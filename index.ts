import duckdb from "duckdb";
import fs from "fs";

let db = null;
// Open a new db file with RW permissions so it would create the file
async function openDb() {
  if (db) {
    console.log("db already opened");
    return;
  }
  return new Promise((resolve, reject) => {
    db = new duckdb.Database("duck.db", { access_mode: "READ_WRITE" }, (err) => {
      if (err) {
        console.log("open db error", err);
        db = null;
        reject(err);
        return;
      } else {
        console.log("db opened successfully");
        resolve();
      }
    });
  });
}

async function closeDb() {
  if (db === null) {
    console.log("db already closed");
    return;
  }
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        console.log("close db error", err);
        reject(err);
        return;
      } else {
        console.log("db closed successfully");
        resolve();
      }
    });
  });
}

async function runsql(text) {
  return new Promise((resolve, reject) => {
    db.run(text, (error) => {
      if (error) {
        console.log("run sql err", error);
        reject(error);
      } else {
        console.log("runsql ok", text);
        resolve();
      }
    });
  });
}

await openDb();
await runsql("select 42 as fortytwo");
await closeDb();
fs.unlinkSync("duck.db");
console.log("del ok");
