const LandingLayout = ({ children }) => {
  return (
    <>
      <div>header</div>
      <main>{children}</main>
      <div>footer</div>
    </>
  );
};

export default LandingLayout;
