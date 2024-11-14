"use client";
import dynamic from "next/dynamic";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import {Path} from "../constants.ts";


export function Loading() {
  return (
    <div>    
      loading
    </div>
  );
}

const HomePage = dynamic(async () => (await import("./home")).Home, {
  loading: () => <Loading/>,
});

const AboutPage = dynamic(async () => (await import("./about")).About, {});



export function WindowContent(props: { children: React.ReactNode }) {
  return (
    <div>
      {props?.children}
    </div>
  );
}

function Screen() {

  const renderContent = () => {

    return (
      <>
        {/* <SideBar className={isHome ? styles["sidebar-show"] : ""} /> */}
        {/* 用WindowContent组件去包裹路由 */}
        <WindowContent>
          <Routes>
            <Route path={Path.Layout} element={<HomePage />} />
            <Route path={Path.About} element={<AboutPage />} />
          </Routes>
        </WindowContent>
      </>
    );
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
}



export default function Layout() {
  return (
    // <ErrorBoundary>
      <Router>
        <Screen />
      </Router>
    // </ErrorBoundary>
  );
}
