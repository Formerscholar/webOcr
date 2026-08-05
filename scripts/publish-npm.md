# 发布到 npm 操作说明

当前账号 `yz-chad` 已开启 2FA，**必须**使用带 **Bypass two-factor authentication** 的 Granular Token，普通 OTP / 旧 token 都会 403。

## 步骤

1. 打开：https://www.npmjs.com/settings/yz-chad/tokens/create  
2. 选择 **Granular Access Token**  
3. 配置：
   - Token name：`webocr-publish`
   - Expiration：按需（如 90 days）
   - Permissions：**Read and write**
   - Packages：**All packages**（首次发布 `webocr` 还不存在，不能只勾选已有包）
   - **勾选 Bypass two-factor authentication** ← 最关键
4. 生成后复制 token（只显示一次）
5. 打开仓库：https://github.com/Formerscholar/webOcr/settings/secrets/actions  
6. **New repository secret**
   - Name：`NPM_TOKEN`
   - Value：刚才的 token
7. 打开：https://github.com/Formerscholar/webOcr/actions/workflows/publish-npm.yml  
8. **Run workflow** → 等待绿色成功  
9. 验证：https://www.npmjs.com/package/webocr  

## 本地发布（可选）

```bash
npm config set //registry.npmjs.org/:_authToken=你的token
npm publish --access public --ignore-scripts --registry https://registry.npmjs.org/
```
