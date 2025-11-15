# Frontend Plugins

## Health Check Plugin
Provides comprehensive health monitoring endpoints:

### Endpoints
- `/health` - Detailed system status including:
  - Webpack compilation state
  - Memory usage
  - System resources
  - Uptime statistics
  
- `/health/simple` - Quick status check
- `/health/ready` - Kubernetes readiness probe
- `/health/live` - Kubernetes liveness probe
- `/health/errors` - Compilation errors/warnings
- `/health/stats` - Performance metrics

### Benefits
1. **Monitoring & Debugging**
   - Real-time compilation status
   - Memory usage tracking
   - Error detection
   
2. **DevOps Integration**
   - Kubernetes health probes
   - Load balancer checks
   - Uptime monitoring

3. **Development**
   - Quick status checks
   - Performance profiling
   - Memory leak detection

### Usage
```js
const healthPlugin = new WebpackHealthPlugin();
devServer.use(setupHealthEndpoints(devServer, healthPlugin));
```
