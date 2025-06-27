import { useFirebaseMessaging } from '../../hooks/useFirebaseMessaging';

const LandingLayout = ({ children }) => {
  useFirebaseMessaging();

  return (
    <>
      <div>header</div>
      <main>{children}</main>
      <div>footer</div>
    </>
  );
};

export default LandingLayout;
