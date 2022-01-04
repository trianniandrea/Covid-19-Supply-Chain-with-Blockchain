//You have to use the link component to link between you pages 
import { Link } from "react-router-dom";

const CourierPage = () => {
  return (
    <div>

        <div class="titolo"> 
          <p>Courier Landing Page </p> 
          <Link to="/" class="back"> Back to home</Link>
        </div>

        <div class="homepage"> 
          <div class="page-content">          
            content
          </div>
        </div>

    </div>
  );
};

export default CourierPage;