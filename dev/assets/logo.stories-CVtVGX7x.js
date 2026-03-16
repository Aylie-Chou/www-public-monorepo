import{j as r}from"./jsx-runtime-EKYJJIwR.js";import{L as c,b as p,a as l}from"./logo-footer-DFmTNltI.js";import{R as t}from"./release-branch-D9ze_MWd.js";import{L as n,a as m}from"./constants-DBlDlG4M.js";import"./clsx-B-dksMZM.js";const h={title:"Brand/Logo",component:c,argTypes:{type:{control:"radio",options:Object.values(n)},releaseBranch:{control:"radio",options:Object.values(t)}},decorators:[e=>r.jsx("div",{className:"h-screen bg-gray-300 p-[20px]",children:r.jsx(e,{})})]},a={args:{type:n.default,releaseBranch:t.master},render:e=>r.jsx(c,{type:e.type,releaseBranch:e.releaseBranch})},s={args:{type:n.default,releaseBranch:t.master},render:e=>r.jsx(p,{type:e.type,releaseBranch:e.releaseBranch})},o={args:{type:m.default,releaseBranch:t.master},render:e=>r.jsx(l,{type:e.type,releaseBranch:e.releaseBranch})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    type: LOGO_TYPE.default,
    releaseBranch: RELEASE_BRANCH.master
  },
  render: args => <LogoHeader type={args.type} releaseBranch={args.releaseBranch} />
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    type: LOGO_TYPE.default,
    releaseBranch: RELEASE_BRANCH.master
  },
  render: args => <LogoFooter type={args.type} releaseBranch={args.releaseBranch} />
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    type: LOGO_SYMBOL_TYPE.default,
    releaseBranch: RELEASE_BRANCH.master
  },
  render: args => <LogoSymbol type={args.type} releaseBranch={args.releaseBranch} />
}`,...o.parameters?.docs?.source}}};const i=["HeaderLogo","FooterLogo","SymbolLogo"];export{s as FooterLogo,a as HeaderLogo,o as SymbolLogo,i as __namedExportsOrder,h as default};
