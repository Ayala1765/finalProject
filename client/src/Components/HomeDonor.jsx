import "./HomeDonor.css"
import { useSelector } from "react-redux"

const HomeDonor = () => {
  const { user } = useSelector((state) => state.token)

  return (
    <div className="hd3-main">
      <div className="hd3-textside">
        <h1>Welcome{user?.name ? `, ${user.name}` : ""}</h1>
        <h2 className="hd3-brand">Keren Y&Y</h2>
        <p className="hd3-sub">
          Where every donation inspires hope.<br/>
          Join us in supporting families with dignity and care.
        </p>
        <div className="hd3-actions">
          <button className="hd3-btn main" onClick={() => window.location.href="/AddDonation"}>For Donation</button>
          <button className="hd3-btn" onClick={() => window.location.href="/about"}>About</button>
        </div>
      </div>
      <div className="hd3-bgside"></div>
    </div>
  )
}

export default HomeDonor