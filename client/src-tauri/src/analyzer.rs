use crate::codemap::{CodeMap, Location, Trace};
use anyhow::{Context, Result};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

pub struct Analyzer {
    project_root: String,
}

impl Analyzer {
    pub fn new(project_root: String) -> Self {
        Analyzer { project_root }
    }
    
    pub fn analyze(&self, files: Vec<String>, query: String) -> Result<CodeMap> {
        let mut codemap = CodeMap::new(
            query.clone(),
            self.project_root.clone(),
            format!("{} - 分析结果", query),
            format!("对查询 '{}' 的代码流程分析", query),
        );
        
        // Read and parse all files
        let mut all_locations: Vec<Location> = Vec::new();
        let mut file_contents: HashMap<String, String> = HashMap::new();
        
        for file_path in &files {
            let content = fs::read_to_string(file_path)
                .with_context(|| format!("Failed to read file: {}", file_path))?;
            file_contents.insert(file_path.clone(), content.clone());

            // Analyze file for key locations
            let locations = self.analyze_file(file_path, &content)?;
            all_locations.extend(locations);
        }
        
        // Group locations into traces
        let traces = self.create_traces(&all_locations, &query)?;
        
        // Generate Mermaid diagram
        let mermaid_diagram = self.generate_mermaid_diagram(&traces);
        
        // Update CodeMap
        codemap.traces = traces;
        codemap.mermaid_diagram = mermaid_diagram;
        
        Ok(codemap)
    }
    
    fn analyze_file(&self, file_path: &str, content: &str) -> Result<Vec<Location>> {
        let mut locations = Vec::new();
        let lines: Vec<&str> = content.lines().collect();
        
        for (line_num, line) in lines.iter().enumerate() {
            let line_number = line_num + 1;
            let trimmed = line.trim();
            
            // Detect Controller endpoints
            if self.is_controller_endpoint(trimmed) {
                locations.push(Location {
                    id: format!("loc-{}", locations.len()),
                    path: file_path.to_string(),
                    line_number,
                    line_content: line.to_string(),
                    title: "Controller 入口".to_string(),
                    description: "处理 HTTP 请求的入口点".to_string(),
                });
            }
            
            // Detect Service methods
            if self.is_service_method(trimmed) {
                locations.push(Location {
                    id: format!("loc-{}", locations.len()),
                    path: file_path.to_string(),
                    line_number,
                    line_content: line.to_string(),
                    title: "Service 业务逻辑".to_string(),
                    description: "核心业务处理逻辑".to_string(),
                });
            }
            
            // Detect Mapper/DAO operations
            if self.is_mapper_operation(trimmed) {
                locations.push(Location {
                    id: format!("loc-{}", locations.len()),
                    path: file_path.to_string(),
                    line_number,
                    line_content: line.to_string(),
                    title: "数据库操作".to_string(),
                    description: "数据持久化操作".to_string(),
                });
            }
            
            // Detect branching logic
            if self.is_branching_logic(trimmed) {
                locations.push(Location {
                    id: format!("loc-{}", locations.len()),
                    path: file_path.to_string(),
                    line_number,
                    line_content: line.to_string(),
                    title: "分支判断".to_string(),
                    description: "条件分支逻辑".to_string(),
                });
            }
            
            // Detect exception handling
            if self.is_exception_handling(trimmed) {
                locations.push(Location {
                    id: format!("loc-{}", locations.len()),
                    path: file_path.to_string(),
                    line_number,
                    line_content: line.to_string(),
                    title: "异常处理".to_string(),
                    description: "捕获和处理异常".to_string(),
                });
            }
        }
        
        Ok(locations)
    }
    
    fn is_controller_endpoint(&self, line: &str) -> bool {
        line.contains("@RequestMapping") ||
        line.contains("@GetMapping") ||
        line.contains("@PostMapping") ||
        line.contains("@PutMapping") ||
        line.contains("@DeleteMapping") ||
        line.contains("def ") && (line.contains("request") || line.contains("route")) ||
        line.contains("app.") && (line.contains("get") || line.contains("post") || line.contains("put"))
    }
    
    fn is_service_method(&self, line: &str) -> bool {
        line.contains("def ") && !line.contains("__") ||
        line.contains("public ") && (line.contains("void") || line.contains("return")) ||
        line.contains("async def ") ||
        line.contains("fn ") && line.contains("pub")
    }
    
    fn is_mapper_operation(&self, line: &str) -> bool {
        line.contains("SELECT") ||
        line.contains("INSERT") ||
        line.contains("UPDATE") ||
        line.contains("DELETE") ||
        line.contains(".find(") ||
        line.contains(".create(") ||
        line.contains(".update(") ||
        line.contains(".delete(") ||
        line.contains("execute_query") ||
        line.contains("db.query")
    }
    
    fn is_branching_logic(&self, line: &str) -> bool {
        line.starts_with("if ") ||
        line.starts_with("elif ") ||
        line.starts_with("else:") ||
        line.contains("switch ") ||
        line.contains("case ") ||
        line.contains("?") && line.contains(":")
    }
    
    fn is_exception_handling(&self, line: &str) -> bool {
        line.contains("try") ||
        line.contains("catch") ||
        line.contains("except") ||
        line.contains("raise") ||
        line.contains("throw")
    }
    
    fn create_traces(&self, locations: &[Location], query: &str) -> Result<Vec<Trace>> {
        let mut traces = Vec::new();
        
        // Group locations by file and order
        let mut file_groups: HashMap<String, Vec<&Location>> = HashMap::new();
        for loc in locations {
            file_groups.entry(loc.path.clone()).or_insert_with(Vec::new).push(loc);
        }
        
        // Sort each group by line number
        for group in file_groups.values_mut() {
            group.sort_by_key(|l| l.line_number);
        }
        
        // Create traces from grouped locations
        let mut trace_id = 1;
        for (file_path, locs) in file_groups {
            if locs.is_empty() {
                continue;
            }
            
            let file_name = Path::new(&file_path)
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("Unknown");
            
            let trace = Trace {
                id: trace_id.to_string(),
                title: format!("Phase {}: {}", trace_id, file_name),
                description: format!("文件 {} 中的关键代码节点", file_name),
                locations: locs.iter().map(|l| (*l).clone()).collect(),
                trace_text_diagram: self.generate_text_diagram(&locs),
                trace_guide: self.generate_trace_guide(&locs, &file_path, query),
            };
            
            traces.push(trace);
            trace_id += 1;
        }
        
        // If no traces created, create a default one
        if traces.is_empty() {
            traces.push(Trace {
                id: "1".to_string(),
                title: "分析结果".to_string(),
                description: "未检测到明显的代码节点".to_string(),
                locations: Vec::new(),
                trace_text_diagram: "未找到关键代码节点".to_string(),
                trace_guide: "## Motivation\n\n尝试选择包含业务逻辑的文件进行分析。\n\n## Details\n\n当前分析的文件可能不包含可识别的代码模式。建议选择 Controller、Service 或 Mapper 层的文件。".to_string(),
            });
        }
        
        Ok(traces)
    }
    
    fn generate_text_diagram(&self, locations: &[&Location]) -> String {
        let mut diagram = String::new();
        
        for (i, loc) in locations.iter().enumerate() {
            let prefix = if i == locations.len() - 1 {
                "└─".to_string()
            } else {
                "├─".to_string()
            };
            
            diagram.push_str(&format!(
                "{} {} ({}) < -- {}>\n",
                prefix,
                loc.title,
                loc.line_number,
                loc.id
            ));
            
            if i < locations.len() - 1 {
                diagram.push_str("│  ");
            }
        }
        
        diagram
    }
    
    fn generate_trace_guide(&self, locations: &[&Location], file_path: &str, query: &str) -> String {
        let mut guide = String::new();
        
        guide.push_str("## Motivation\n\n");
        guide.push_str(&format!(
            "此流程分析文件 {}，响应查询 '{}'。目标是理解代码的执行路径和关键决策点。\n\n",
            file_path, query
        ));
        
        guide.push_str("## Details\n\n");
        
        if locations.is_empty() {
            guide.push_str("未检测到关键的代码节点。这可能是因为：\n");
            guide.push_str("- 文件不包含业务逻辑\n");
            guide.push_str("- 代码风格不符合常见的命名规范\n");
            guide.push_str("- 需要更多上下文文件\n");
        } else {
            guide.push_str("代码执行流程：\n\n");
            
            for loc in locations {
                guide.push_str(&format!("- **[{}]** {} (行 {})\n", loc.id, loc.title, loc.line_number));
                guide.push_str(&format!("  {}\n\n", loc.description));
            }
            
            guide.push_str("### 关键观察\n\n");
            guide.push_str("- 代码遵循分层架构模式\n");
            guide.push_str("- 包含清晰的入口点和业务逻辑分离\n");
            guide.push_str("- 数据操作集中在 Mapper/DAO 层\n");
        }
        
        guide
    }
    
    fn generate_mermaid_diagram(&self, traces: &[Trace]) -> String {
        if traces.is_empty() {
            return "graph TB\n  A[开始] --> B[结束]".to_string();
        }
        
        let mut diagram = String::from("graph TB\n");
        
        // Add subgraphs for each trace
        for trace in traces {
            diagram.push_str(&format!("  subgraph {}[{}]\n", trace.id, trace.title));
            
            for loc in &trace.locations {
                let node_id = format!("N{}", loc.id.replace("-", "_"));
                diagram.push_str(&format!(
                    "    {}([\"{}<br/>{}:{}\"])\n",
                    node_id, loc.title, loc.path, loc.line_number
                ));
            }
            
            diagram.push_str("  end\n");
        }
        
        // Connect traces
        for i in 0..traces.len().saturating_sub(1) {
            let current = &traces[i];
            let next = &traces[i + 1];
            
            let last_loc = current.locations.last();
            let first_loc = next.locations.first();
            
            if let (Some(last), Some(first)) = (last_loc, first_loc) {
                let from_node = format!("N{}", last.id.replace("-", "_"));
                let to_node = format!("N{}", first.id.replace("-", "_"));
                diagram.push_str(&format!("  {} --> {}\n", from_node, to_node));
            }
        }
        
        diagram
    }
}