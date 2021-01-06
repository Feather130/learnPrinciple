import React from "react";

// 使用Context做数据跨层级传递
// step1: 创建context对象
export const RouterContext = React.createContext();

// step2: 使用context对象的Provider传递value

// step3: 子组件消费value： Consumer、useContext、contextType
