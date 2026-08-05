// 开发时由 vite 中间件从 node_modules 提供 /ort/*
// 构建产物在 vite closeBundle 中复制。此脚本保留为兼容入口。
console.log("[copy-ort] skip — vite serves /ort from node_modules/onnxruntime-web/dist");
