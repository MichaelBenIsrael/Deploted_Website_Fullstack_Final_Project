import { React } from "react";
import { useState, useEffect } from "react";
import { BsHeadset } from "react-icons/bs";
import { FaPhoneSquareAlt, FaEnvelopeOpen } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { dashBoardLinkList } from "../../assets/links";
import { subject } from "../../assets/subjects";
import FormControl from "../common/FormControl";
import Button from "../common/Button";
import Modal from "../common/Modal";
import Select from "../common/Select";
import { getCookie } from "../../assets/cookies";
import { stringNullOrEmpty, validateEmail } from "../../assets/validations";
import { siteName } from "../../assets/const";

const Contact = () => {

    const navigate = useNavigate();
    useEffect(() => {
        document.title = `${siteName} - Contact Us`;
        // check if logged in, if not redirect to login page.
        const sessionId = getCookie("sessionId");
        console.log(sessionId);
        if (!sessionId) {
            navigate('/');
        }
    }, [navigate]);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [selectedSubject, setSelectSubject] = useState(0);

    const [modalMessage, setModalMessage] = useState("Please fill all the information on the form, requirement are in the tooltip.");
    const [showModal, setShowModal] = useState(false);

    const submitContactRequest = () => {
        if (!stringNullOrEmpty(fullName) && validateEmail(email) && !stringNullOrEmpty(message) && selectedSubject !== 0) {
            // send request to server
        } else {
            setShowModal(true);
        }
    }

    return (
        <>
            <Navbar links={dashBoardLinkList} currentActive="Contact Us" />
            <main className="page">

                <h1>Contact Us</h1>

                <div className="grid-container">
                    <div className="grid-item-form">
                        <form>
                            <FormControl
                                inputType="text" inputId="fullname" placeHolder="Full Name" isRequired={true}
                                containToolTip={true} toolTipContent="Example: John Doe" onChangeCallback={setFullName} />

                            <FormControl
                                inputType="email" inputId="email" placeHolder="Email Address" isRequired={true}
                                containToolTip={true} toolTipContent="Example: johndoe@gmail.com" onChangeCallback={setEmail} />

                            <Select subjects={subject} onChangeCallback={setSelectSubject} />

                            <textarea id="message" rows="5" placeholder="Your message.." onChange={(e) => setMessage(e.target.value)}></textarea>

                            <Button className="btn" content="Submit" onClickCallback={submitContactRequest} />
                        </form>
                    </div>
                    <div className="grid-item-support">
                        <div className="support">
                            <p className="text"><span style={{ verticalAlign: "middle" }}><BsHeadset /></span> Need 24/7 Support?</p>
                            <Button className="reverse-btn" content="Contact Support" />
                        </div>
                        <div className="support">
                            <p className="text"><span style={{ verticalAlign: "middle" }}><FaPhoneSquareAlt /></span> Call Sales Now! <NavLink>+1-512-827-3500</NavLink>
                            </p>
                        </div>
                        <div className="support">
                            <p className="text"><span style={{ verticalAlign: "middle" }}><FaEnvelopeOpen /></span> Mailing Address</p>
                            <span>RandomCompany</span>
                            <span>RandomAddress</span>
                            <span>RandomCountry, RandomCity, RandomStreet, 5</span>
                        </div>
                        <div className="support">
                            {/* <!-- Random place from google maps. --> */}
                        </div>
                    </div>
                </div>
                {showModal && <Modal errorMessage={modalMessage} setDisplay={setShowModal} />}
            </main>
        </>
    );
};

export default Contact;