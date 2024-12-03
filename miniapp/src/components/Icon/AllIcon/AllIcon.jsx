import './AllIcon.css';
import Rails from '../Rails/Rails';
import TrainBlue from '../Train-blue/Train-blue';
import Table from '../Table/Table';
import TrainYellow from '../Train-yellow/Train-yellow';

const AllIcon = ({animClass}) => {

    return (
        <div className="icon-container">
            <div className="icon-content">
                <div className="rails-svg">
                    <Rails className={"rails"} />
                </div>
                
                <div className="train-container">
                    <TrainBlue className={`trainBlue-svg-${animClass}`} />
                </div>
            </div>
        </div>
    );
}

export default AllIcon;
