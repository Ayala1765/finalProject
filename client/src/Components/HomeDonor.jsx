import "./HomeDonor.css";
import { useDispatch,useSelector } from 'react-redux';

const HomeDonor = () => {
   const { token, role, user } = useSelector((state) => state.token);

  return (<>
    <div className="home-donor-container">
      <h1 className="home-donor-title">Welcome to {user?.name} Y&Y</h1>
      <p className="home-donor-text">Thank you for supporting us!</p>
    </div></>
  );
};

export default HomeDonor;