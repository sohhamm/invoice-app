interface LayoutProps {
  children: JSX.Element
}

export default function Layout({children}: LayoutProps) {
  return <div>{children}</div>
}
