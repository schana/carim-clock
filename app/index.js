import * as clock_manager from "./clock/manager";
import * as storage_watcher from "./storage/watcher";

storage_watcher.initialize();
clock_manager.initialize();
