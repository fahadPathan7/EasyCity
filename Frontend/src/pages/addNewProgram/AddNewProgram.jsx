import BackButton from '../../components/back_button/BackButton';
import NavBar from '../../components/navBar/NavBar';
import './AddNewProgram.css';
import AddNewProgramForm from './AddNewProgramForm';

export default function AddNewProgram() {

    return <>
        <NavBar />        
        <div className="addnewprogram-canvas">
            <div className="addnewprogram-title-addnewprogrampage">
                <BackButton /> <div> প্রোগ্রামের তথ্যসমূহ দিন</div>
            </div>
            <AddNewProgramForm />
        </div>
    </>;

}