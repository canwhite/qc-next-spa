"use client"
import dynamic from "next/dynamic";
import { memo, Suspense } from "react";

//文件layout，这里也有路由
const Layout= dynamic(() => import("./components/layout"),{ssr:false});

//--路由体系--
//因为我们用的是next的App路由体系，所以这个page就是/,其他是根据路径设置的
//原有的在page文件夹建立的page路由体系，现在用的比较少了
const Index = function () {
  return (
    <Suspense fallback="loading">
      <Layout />
    </Suspense>
  );
};

export default memo(Index);
