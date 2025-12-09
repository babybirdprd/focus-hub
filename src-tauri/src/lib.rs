// Remove the nested module definition since we are using the file system structure
// and we want to avoid circular or self-referential imports.
// We should import the plugin module from the crate root if declared there, or declare it here.

// However, standard Tauri pattern is usually:
// src/plugins/focus_core/mod.rs exists
// src/lib.rs declares `mod plugins;` if plugins is a folder with mod.rs, OR `mod plugins { ... }`

// Let's fix the module structure.
// The file system is:
// src-tauri/src/lib.rs
// src-tauri/src/plugins/focus_core/mod.rs

// In Rust, if we want to access `plugins/focus_core`, we usually need `mod plugins` in `lib.rs`
// and then `pub mod focus_core` in `plugins/mod.rs` OR `mod focus_core` inside `lib.rs` if `plugins` is just a namespace.

// Since I created `src-tauri/src/plugins/focus_core/mod.rs`, I probably missed `src-tauri/src/plugins/mod.rs`.
// Let's check if `src-tauri/src/plugins/mod.rs` exists.
// If not, I should define the module structure correctly in `lib.rs`.

pub mod plugins {
    pub mod focus_core;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(plugins::focus_core::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
