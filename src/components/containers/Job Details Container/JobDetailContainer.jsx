import { ArrowCircleRight2, ArrowLeft } from 'iconsax-react';
import { PopUp } from '../../pops/Pop Up/PopUp.jsx';
import { useEffect, useState } from 'react';
import ApplyContainer from '../../containers/Apply Container/ApplyContainer.jsx';
import ContactContainer from '../../containers/Contact Container/ContactContainer.jsx';
import ProfileImage from '../../general/Profile Image/ProfileImage';
import style from './JobDetailContainer.module.css';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import ViewBidsContainer from '../View Bids Container/ViewBidsContainer.jsx';
import RatingStars from '../../general/RatingStars/RatingStars.jsx';
import CommandButton from '../../buttons/Command Buttons/CommandButton.jsx';
import JobCompletionContainer from '../Job Completion Container/JobCompletionContainer.jsx';
import JobTerminateContainer from '../Job Terminate Container/JobTerminateContainer.jsx';
import ProfileContainer from '../Profile Container/ProfileContainer.jsx';
import { useAuth } from '../../../utils/AuthContext.jsx';
import BidCard from '../../cards/Bid Card/BidCard.jsx';

const JobDetailContainer = ({ job, isClient = false, isFreelancer = false, hasApplied=false, setHasApplied=()=>{} }) => {
    const [activePopup, setActivePopup] = useState(null);
    const [isApplyOpen, setIsApplyOpen] = useState(false)
    const [isContactOpen, setIsContactOpen] = useState(false)
    const [isCompleteOpen, setIsCompleteOpen] = useState(false)
    const [isTerminateOpen, setIsTerminateOpen] = useState(false)
    const [isViewBidsOpen, setIsViewBidsOpen] = useState(false);
    const [offerJob, setOfferJob] = useState(false)
    const [bids, setBids] = useState([])
    const [offers, setOffers] = useState([])
    const [appliedBid, setAppliedBid] = useState(null)
    const {user} = useAuth()
    const {id} = useParams()


    const navigate = useNavigate();

    const handleBackButtonClicked = () => {
        navigate(-1);
    };


    const openPopup = (popup) => {
        closeAllPopups()
        switch (popup){
        case 'apply':
            setIsApplyOpen(true)
            break;
        case 'contact':
            setIsContactOpen(true);
            break;
        case 'complete':
            setIsCompleteOpen(true)
            break;
        case 'terminate':
            setIsTerminateOpen(true)
            break;
        case 'view-bids':
            setIsViewBidsOpen(true)
            break;
        case 'offer-job':
            setOfferJob(true)
            break;
        
        }

    }


    const closePopup = () => {
        closeAllPopups()
    };

    const closeAllPopups=()=>{
        setIsApplyOpen(false);
        setIsContactOpen(false);
        setIsCompleteOpen(false);
        setIsTerminateOpen(false);
        setIsViewBidsOpen(false);        
    }

    const handleJobComplete = () => {
        // Implement the logic for job completion
        console.log("Job completion requested."); // Placeholder for actual logic
        closePopup(); // Close the pop-up after handling the request
    };

    const fetchBids = async () => {
        const url = `https://auth.bizawit.com/api/v1/job/${job.id}/job-bid`;
        try {
            const response = await axios.get(url);
            setBids(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchOffers = async () => {
        const url = `https://auth.bizawit.com/api/v1/job/${job.id}/job-offer`;
        try {
            const response = await axios.get(url);
            setOffers(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };



    const deleteBid = async (id) => {
        
        
        try{
        const url = `https://auth.bizawit.com/api/v1/job-bid/${id}`
        await axios.delete(url)
        setHasApplied(false)
        setAppliedBid(null)

    } catch(error) {console.error(error)}
    }


    
    const fetchAppliedBid = () => {

        const userBid = bids.find(bid => bid.user_id === user.id)
        setAppliedBid(userBid || null)
        
        }


    useEffect(() => {
        fetchBids();
        fetchOffers();

    }, [id]);

    useEffect(()=>{
        fetchBids()
        if(hasApplied){
            fetchAppliedBid();
        }
    }, [hasApplied, bids, user.id])

    useEffect(()=>{
        if(activePopup !== null)
            openPopup()
        console.log(profilePic)
    }, [activePopup])

    const profilePic = `https://auth.bizawit.com/api/v1/upload/original/${job.profile_picture}`

    return (
        <div className={style.container}>
            <button className={style.back_button} onClick={handleBackButtonClicked}>
                <ArrowLeft size="20px" color="var(--primary-color)" /> Back
            </button>

            <div className={style.user_info}>
                <div className={style.profile}>
                    <ProfileImage userId={job.client_id} src={job.client_profile_picture} size='46px' />
                    <div className={style.info}>
                        <p className={style.username}>{job.client_first_name + " " + job.client_last_name}</p>
                        <p className={style.location}>{job.client_location || "Ethiopia"}</p>
                    </div>
                </div>
                <div className={style.user_status}>
                    <div className={style.user_field}>
                        Rating
                        <RatingStars star={job.client_rating || 3} />
                    </div>
                    <div className={style.user_field}>
                        Created at
                        <p className={style.date}>{job.created_at || "20/12/24"}</p>
                    </div>
                </div>
            </div>

            <div className={style.job}>
                <p className={style.title}>{job.job_title}</p>
                <p className={style.job_description}>{job.job_description}</p>
                <div className={style.tags}>
                    <ul className={style.keywords}>
                        {job.tags &&
                            job.tags.split(',').map((k, index) => (
                                <li className={style.key} key={index}>
                                    {k}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            {(isClient || isFreelancer) ?
            <div className={style.user_info}>
                Freelancer
                <div className={style.profile}>
                    <ProfileImage userId={job.freelance_id} src={job.freelance_profile_picture} size='46px' />
                    <div className={style.info}>
                        <p className={style.username}>{job.freelance_first_name + " " + job.freelance_last_name}</p>
                        <p className={style.location}>{job.freelance_location || "Ethiopia"}</p>
                    </div>
                </div>
                <div className={style.user_status}>
                    <div className={style.user_field}>
                        Rating
                        <RatingStars star={job.freelance_rating || 3} />
                    </div>
                    <div className={style.user_field}>
                        Job Completed
                        <p className={style.date}>{job.created_at || "20/12/24"}</p>
                    </div>
                    <div className={style.user_field}>
                        Completion Rate
                        <p className={style.date}>{job.created_at || "20/12/24"}</p>
                    </div>
                </div>
            </div>
            :
            <div className={style.applied_bid}>
            {hasApplied && appliedBid ?(
                <>
                You have applied to this job.
                <BidCard bid={appliedBid} onDelete={()=>deleteBid(appliedBid.id)}/>
                </>
            )
             :
            <p>No pending applications on this job</p>
             }
            </div>

            }

            <div className={style.buttons}>
                {(!isClient && !isFreelancer) &&(
                <>
                {!hasApplied &&
                <CommandButton commandTerm={"Apply"} onClick={()=>openPopup('apply')} />
                }
                <CommandButton commandTerm={"Contact"} onClick={()=>openPopup('contact')} />


                </>
                )}
                {job.freelance_id && job.freelance_id === user.id &&
                <>
                <CommandButton commandTerm={"Deliver"} onClick={()=>openPopup('complete')} />
                <CommandButton commandTerm={"Request Cancellation"} onClick={()=>openPopup('terminate')} />
                </>
                }
                {isClient && 
                <>
                <CommandButton commandTerm={"View bids and offers"} onClick={()=>openPopup('view-bids')} />
                <CommandButton commandTerm={"Offer Job"} onClick={()=>openPopup('offer-job')} />
                </>
                }
            </div>


     

            {/* Render active pop-up based on activePopup state */}
            <PopUp
                state={isApplyOpen}
                setState={setIsApplyOpen}
                height={'fit-content'}
                width={'fit-content'}
            >
                {!hasApplied &&
                <ApplyContainer setIsOpen={closePopup} jobID={job.id} is_negotiable={job.job_negotiation == 1} job_price={job.job_price} onSuccess={()=>{
                    setHasApplied(true)
                    
                }}/>
                // :
                // <BidCard  setIsOpen={setIsViewBidsOpen} />
}
            </PopUp>

            <PopUp
                state={isContactOpen}
                setState={setIsContactOpen}
                height={'fit-content'}
                width={'fit-content'}
            >
                <ContactContainer />
            </PopUp>

            <PopUp
                state={isCompleteOpen}
                setState={setIsCompleteOpen}
                height={'fit-content'}
                maxWidth={500}
            >
                    <JobCompletionContainer  jobID={id} setIsOpen={setIsCompleteOpen} />

            </PopUp>

            <PopUp
                state={isTerminateOpen}
                setState={setIsTerminateOpen}
                height={'fit-content'}
                width={'fit-content'}
            >
                <JobTerminateContainer  jobID={job.id} setIsOpen={setIsTerminateOpen} />

            </PopUp>

            <PopUp
                state={isViewBidsOpen}
                setState={setIsViewBidsOpen}
                height={'fit-content'}
                width={'fit-content'}
            >
                <ViewBidsContainer jobID={job.id} setIsOpen={setIsViewBidsOpen} />
            </PopUp>
            <PopUp
            state={offerJob}
            setState={setOfferJob}>
                height={'fit-content'}
                width={'fit-content'}
                <ProfileContainer profiles={[]} setIsOpen={setOfferJob} search={true} />
            </PopUp>
        </div>
    );
};

export default JobDetailContainer;
