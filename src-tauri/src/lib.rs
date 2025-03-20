#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Define migrations inside the function
    let migrations = vec![tauri_plugin_sql::Migration {
        version: 1,
        description: "Create task table",
        sql: "CREATE TABLE IF NOT EXISTS task (
            id TEXT PRIMARY KEY, 
            title TEXT,
            completed INTEGER DEFAULT 0, 
            time TEXT, 
            created_at TEXT DEFAULT (datetime('now')), 
            updated_at TEXT DEFAULT (datetime('now'))
        );",
        kind: tauri_plugin_sql::MigrationKind::Up,
    }];

    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:main.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_haptics::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
