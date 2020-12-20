// export { default as login } from "./acl/login"; // {default: {}}
// export { default as user } from "./acl/user";
// export { default as role } from "./acl/role";
// export { default as permission } from "./acl/permission";
// export { default as category } from "./category";
// export { default as clientUser } from "./clientUser";
// export { default as order } from "./order";
// export { default as tradeMark } from "./product/tradeMark";
// export { default as attr } from "./product/attr";
// export { default as spu } from "./product/spu";
// export { default as sku } from "./product/sku";
// import { default as order } from './order' // 完整引入
// import order from './order' // 完整引入的简写

const context = require.context(".", true, /\.js$/);
const modules = context.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");

  if (moduleName !== "index") {
    moduleName.split("/")[1] !== "index"
      ? (modules[moduleName.split("/")[1]] = context(modulePath).default)
      : (modules[moduleName.split("/")[0]] = context(modulePath).default);
    return modules;
  } else {
    return modules;
  }
}, {});
// console.log(modules);

const api = modules;
export default api;
/* const context = require.context(".", true, /\.js$/);

const api = context
  .keys()
  .map(modulePath => {
    const names = modulePath.split("/");
    let moduleName = names[2] && names[2].slice(0, -3); // login index undefined
    if (moduleName) {
      moduleName = moduleName === "index" ? names[1] : moduleName;
    }
    return {
      modulePath,
      moduleName
    };
  })
  .filter(module => module.moduleName)
  .reduce((modules, module) => {
    modules[module.moduleName] = context(module.modulePath).default;
    return modules;
  }, {});

export default api;*/
