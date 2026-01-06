use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeMap {
    pub schema_version: u32,
    pub metadata: CodeMapMetadata,
    pub title: String,
    pub description: String,
    pub mermaid_diagram: String,
    pub traces: Vec<Trace>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeMapMetadata {
    pub id: String,
    pub title: String,
    pub description: String,
    pub query: String,
    pub project_root: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub tags: Vec<String>,
    pub note: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Trace {
    pub id: String,
    pub title: String,
    pub description: String,
    pub locations: Vec<Location>,
    pub trace_text_diagram: String,
    pub trace_guide: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Location {
    pub id: String,
    pub path: String,
    pub line_number: usize,
    pub line_content: String,
    pub title: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeMapIndex {
    pub version: u32,
    pub project_root: String,
    pub codemaps: Vec<CodeMapMeta>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CodeMapMeta {
    pub id: String,
    pub filename: String,
    pub title: String,
    pub description: String,
    pub query: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub tags: Vec<String>,
    pub note: Option<String>,
}

impl CodeMap {
    pub fn new(
        query: String,
        project_root: String,
        title: String,
        description: String,
    ) -> Self {
        let now = Utc::now();
        let id = format!("{}-{:03}", now.format("%Y%m%d"), Self::generate_sequence());
        
        CodeMap {
            schema_version: 1,
            metadata: CodeMapMetadata {
                id: id.clone(),
                title: title.clone(),
                description: description.clone(),
                query,
                project_root,
                created_at: now,
                updated_at: now,
                tags: Vec::new(),
                note: None,
            },
            title,
            description,
            mermaid_diagram: String::new(),
            traces: Vec::new(),
        }
    }
    
    fn generate_sequence() -> u32 {
        // Simple sequence generator - in real app, read from index
        1
    }
    
    pub fn filename(&self) -> String {
        format!("{}.json", self.metadata.id)
    }
}