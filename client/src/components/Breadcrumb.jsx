function Breadcrumb({ children, className = "" }) {
  return (
    <p className={"inline-block bg-white rounded-sm shadow-sm px-3 py-1.5 text-xs text-gray-600 " + className}>
      {children}
    </p>
  );
}

export default Breadcrumb;
