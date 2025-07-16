import { NavMenu } from "@shopify/app-bridge-react";

export function Menu() {
  return (
    <NavMenu>
      <a href='/' rel='home'>
        Dashboard
      </a>
      <a href='/list-options'>Option Settings</a>
    </NavMenu>
  );
}
