import { memo, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './HistoryBookingCustomer.scss'
import { english, vietnamese } from '../../Languages/HistoryBookingCustomer'
import Question from '../../images/question.png'
import Momo from '../Momo'
import Select from 'react-select';
import DetailBookingCustomer from '../DetailBookingCustomer'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { english as englishLabelCancel, vietnamese as vietnameseLabelCancel, cancelReasonEnglish, cancelReasonVietnamese } from '../../Languages/CancelReason'

function HistoryBookingCustomer({ languageSelected, listBooking, isDisabled, numberOfPages, numberPage, setNumberPage, className, classTab1 }) {
    const [statusBooking, setStatusBooking] = useState(-1)
    const [listBookingShow, setListBookingShow] = useState([])
    const [showPopupCancelTour, setShowPopupCancelTour] = useState(false)
    const [showPopupFeedback, setShowPopupFeedback] = useState(false)
    const [showDetail, setShowDetail] = useState(false)
    const [bookingDetail, setBookingDetail] = useState()

    const handleClickLinkTour = (booking) => {
        setBookingDetail(booking)
        setShowDetail(true)
    }

    const handleClickPay = (rawOrderInfo, rawAmount, tourId, bookingId) => {
        const request = Date.now()
        Momo(request, rawOrderInfo, rawAmount, tourId, false, bookingId, true)
    }

    const handleClickDeposit = (rawOrderInfo, rawAmount, tourId, bookingId) => {
        const request = Date.now()
        Momo(request, rawOrderInfo, rawAmount, tourId, true, bookingId, true)
    }

    useEffect(() => {
        let listBookingShowRaw = []
        if (statusBooking == -1) {
            setListBookingShow([...listBooking])
        }
        else {
            if (statusBooking == 0) {
                listBooking.forEach((item) => {
                    if ((item.tourType == 0 && item.status == 0 && item.status == 0 && today < item.startDate) ||
                        (item.tourType == 2 && item.status == 0 && !item.statusDeposit && today < item.startDate) ||
                        (item.tourType == 2 && item.status == 0 && item.statusDeposit && today >= item.startDate)) {
                        listBookingShowRaw.push(item)
                    }
                })
            }
            else if (statusBooking == 1) {
                listBooking.forEach((item) => {
                    if ((item.tourType == 0 && item.status == 1 && today >= item.startDate) ||
                        (item.tourType == 2 && item.status == 1 && item.statusDeposit && today >= item.startDate) ||
                        (item.tourType == 1 && item.status == 1 && today >= item.startDate) ||
                        (item.tourType == 0 && item.status == 1 && today < item.startDate) ||
                        (item.tourType == 1 && item.status == 1 && today < item.startDate)) {
                        listBookingShowRaw.push(item)
                    }
                })
            }
            else if (statusBooking == 2) {
                listBooking.forEach((item) => {
                    if ((item.tourType == 0 && item.status == 2 && today >= item.startDate) ||
                        (item.tourType == 1 && item.status == 2 && today >= item.startDate) ||
                        (item.tourType == 2 && item.status == 0 && !item.statusDeposit && today >= item.startDate) ||
                        (item.tourType == 2 && item.status == 2)) {
                        listBookingShowRaw.push(item)
                    }
                })
            }
            setListBookingShow(listBookingShowRaw)
        }
    }, [statusBooking])

    const today = new Date().toISOString().split("T")[0]
    const languageList = languageSelected === 'EN' ? english : vietnamese
    const cancelReasonList = languageSelected === 'EN' ? cancelReasonEnglish : cancelReasonVietnamese

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND'
    });

    const [idBookingCancel, setIdBookingReason] = useState('')

    const [reasonCancel, setReasonCancel] = useState(1)
    const [descriptionCancel, setDescriptionCancel] = useState('')

    const [feedback, setFeedback] = useState('')

    const handleCancelBooking = (bookingId) => {
        setIdBookingReason(bookingId)
        setShowPopupCancelTour(true)
    }

    const handleFeedbackTour = (bookingId) => {
        setIdBookingReason(bookingId)
        setShowPopupFeedback(true)
    }

    const handleClickSubmitCancelBooking = () => {
        console.log('Booking ID: ', idBookingCancel)
        console.log('reasonCancel: ', reasonCancel)
        console.log('descriptionCancel: ', descriptionCancel)
    }

    const handleClickSubmitFeedbackTour = () => {
        console.log('Tour ID: ', idBookingCancel)
        console.log('Feedback: ', feedback)
    }

    return (
        <>{showDetail ? <DetailBookingCustomer languageSelected={languageSelected} booking={bookingDetail} isDisabled={isDisabled} setShowDetail={setShowDetail} /> :
            <>
                {showPopupFeedback &&
                    <div className='fade-in cancel-tour'>
                        <div className='popup-cancel-tour'>
                            <div className="d-flex line-input">
                                <div className="mlr-50 input-alone">
                                    <label htmlFor="companyBusinessRegistration" className="d-block title mb-0 font-14">{languageList.txtFeebackAboutTour}<span className="requird-star">*</span></label>
                                    <textarea value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        rows={4} className='input-inline mb-20' />
                                </div>
                            </div>
                            <div className='float-end'>
                                <button className='btn btn-primary btn-cancel-tour'
                                    onClick={handleClickSubmitFeedbackTour}>
                                    {languageSelected === 'EN' ? 'Submit' : 'Gửi'}
                                </button>
                                <button className='btn btn-cancel-tour' onClick={() => setShowPopupFeedback(false)}>
                                    {languageSelected === 'EN' ? 'Cancel' : 'Huỷ'}
                                </button>
                            </div>
                        </div>
                    </div>
                }
                {showPopupCancelTour &&
                    <div className='fade-in cancel-tour'>
                        <div className='popup-cancel-tour'>
                            <div className="d-flex line-input">
                                <div className="mlr-50 input-alone">
                                    <label htmlFor="companyBusinessRegistration" className="d-block title mb-0 font-14">{languageList.txtReason}<span className="requird-star">*</span></label>
                                    <Select className='input-inline basic-multi-select'
                                        isSearchable={false}
                                        hideSelectedOptions={false}
                                        classNamePrefix="select"
                                        options={cancelReasonList}
                                        onChange={(e) => setReasonCancel(e.value)}
                                        defaultValue={cancelReasonList[0]}
                                    />
                                </div>
                            </div>
                            <div className="d-flex line-input">
                                <div className="mlr-50 input-alone">
                                    <label htmlFor="companyBusinessRegistration" className="d-block title mb-0 font-14">{languageList.txtDescription}</label>
                                    <textarea value={descriptionCancel}
                                        onChange={(e) => setDescriptionCancel(e.target.value)}
                                        rows={4} className='input-inline mb-20' />
                                </div>
                            </div>
                            <div className='float-end'>
                                <button className='btn btn-primary btn-cancel-tour'
                                    onClick={handleClickSubmitCancelBooking}>
                                    {languageSelected === 'EN' ? 'Submit' : 'Gửi'}
                                </button>
                                <button className='btn btn-cancel-tour' onClick={() => setShowPopupCancelTour(false)}>
                                    {languageSelected === 'EN' ? 'Cancel' : 'Huỷ'}
                                </button>
                            </div>
                        </div>
                    </div>
                }
                <div className={`fade-in ${className}`}>
                    {[...listBooking].length > 0 ?
                        <>
                            <nav className={`d-flex br-all ${classTab1}`}>
                                <div onClick={() => setStatusBooking(-1)} className={`w-25 text-center tab-history-booking bold ${statusBooking === -1 && 'tab-history-booking-selected'}`}>{languageList.txtAllBooking}</div>
                                <div onClick={() => setStatusBooking(0)} className={`w-25 text-center tab-history-booking bold ${statusBooking === 0 && 'tab-history-booking-selected'}`}>{languageList.txtWaitPay}</div>
                                <div onClick={() => setStatusBooking(1)} className={`w-25 text-center tab-history-booking bold ${statusBooking === 1 && 'tab-history-booking-selected'}`}>{languageList.txtPaid}</div>
                                <div onClick={() => setStatusBooking(2)} className={`w-25 text-center tab-history-booking bold ${statusBooking === 2 && 'tab-history-booking-selected'}`}>{languageList.txtCanceled}</div>
                            </nav>
                            <div className='mt-20'>
                                {listBookingShow.map((item, index) => (
                                    <div key={index} className='mb-20 item-list-history-booking d-flex'>
                                        <div>
                                            <div className='tour-name-history-booking mt-10'>{item.tourName}</div>
                                            <div className='start-date-history-booking mt-10'>{item.startDate}</div>
                                            <div className='start-date-history-booking mt-10'>{`${languageList.txtAdult} ${item.numberOfAdult}, ${languageList.txtChildren} ${item.numberOfChildren}`}</div>
                                            <div className='mt-10'>
                                                {(item.tourType == 0 && item.status == 0 && today < item.startDate && (isDisabled ? <label className='waiting-pay-history-booking'>{languageList.txtWaitPay}</label> : <button onClick={() => handleClickPay(`${item.tourName} ${item.numberOfAdult} Adult, ${item.numberOfChildren} Children`, item.price, item.tourId, item.bookingId)} className='btn-pay-history-booking'>{languageList.txtPayNow}</button>)) ||
                                                    (item.tourType == 0 && item.status == 1 && today < item.startDate && (isDisabled ? <label className='waiting-history-booking'>{languageList.txtWaiting}</label> : <button className='btn-cancel-history-booking' onClick={() => handleCancelBooking(item.bookingId)}>{languageList.txtCancel}</button>)) ||
                                                    (item.tourType == 0 && item.status == 1 && today >= item.startDate && <div className='price-payed-history-booking'>{languageList.txtPaid} {formatter.format(item.price)}{!isDisabled && <button className='btn-feedback-history-booking' onClick={() => handleFeedbackTour(item.tourId)}>{languageList.txtFeedback}</button>}</div>) ||
                                                    (item.tourType == 0 && item.status == 2 && today >= item.startDate && <label className='canceled-history-booking'>{languageList.txtCanceled}</label>) ||
                                                    (item.tourType == 1 && item.status == 1 && today < item.startDate && (isDisabled ? <label className='waiting-history-booking'>{languageList.txtWaiting}</label> : <button className='btn-cancel-history-booking' onClick={() => handleCancelBooking(item.bookingId)}>{languageList.txtCancel}</button>)) ||
                                                    (item.tourType == 1 && item.status == 1 && today >= item.startDate && <div className='price-payed-history-booking'>{languageList.txtPaid} {formatter.format(item.price)}{!isDisabled && <button className='btn-feedback-history-booking' onClick={() => handleFeedbackTour(item.tourId)}>{languageList.txtFeedback}</button>}</div>) ||
                                                    (item.tourType == 1 && item.status == 2 && today >= item.startDate && <label className='canceled-history-booking'>{languageList.txtCanceled}</label>) ||
                                                    (item.tourType == 2 && item.status == 0 && !item.statusDeposit && today < item.startDate && (isDisabled ? <label className='waiting-pay-history-booking'>{languageList.txtWaitPayDeposit}</label> : <button onClick={() => handleClickDeposit(`${item.tourName} ${item.numberOfAdult} Adult, ${item.numberOfChildren} Children`, item.deposit, item.tourId, item.bookingId)} className='btn-pay-history-booking'>{languageList.txtPayDeposit}</button>)) ||
                                                    (item.tourType == 2 && item.status == 0 && !item.statusDeposit && today >= item.startDate && <label className='canceled-history-booking'>{languageList.txtCanceled}</label>) ||
                                                    (item.tourType == 2 && item.status == 0 && item.statusDeposit && today >= item.startDate && (isDisabled ? <label className='waiting-pay-history-booking'>{languageList.txtWaitPay}</label> : <button onClick={() => handleClickPay(`${item.tourName} ${item.numberOfAdult} Adult, ${item.numberOfChildren} Children`, item.price, item.tourId, item.bookingId)} className='btn-pay-history-booking'>{languageList.txtPayNow}</button>)) ||
                                                    (item.tourType == 2 && item.status == 0 && item.statusDeposit && today < item.startDate && <label className='waiting-history-booking'>{languageList.txtWaiting}</label>) ||
                                                    (item.tourType == 2 && item.status == 1 && item.statusDeposit && today >= item.startDate && <div className='price-payed-history-booking'>{languageList.txtPaid} {formatter.format(item.price)}{!isDisabled && <button className='btn-feedback-history-booking' onClick={() => handleFeedbackTour(item.tourId)}>{languageList.txtFeedback}</button>}</div>) ||
                                                    (item.tourType == 2 && item.status == 2 && <label className='canceled-history-booking'>{languageList.txtCanceled}</label>)}
                                            </div>
                                        </div>
                                        <div onClick={() => handleClickLinkTour(item)} className='link-detail-tour'>{languageList.txtDetailTour}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                        :
                        <div className='image-no-booking br-top-left-none'>
                            <img src={Question} className='image-question' />
                            <div className='text-no-booking'>{languageList.txtNoBooking} {!isDisabled && <Link to='/tours' className='link-no-booking'>{languageList.txtBookNow}</Link>}</div>
                        </div>
                    }
                    <div className='d-flex float-end paging'>
                        {numberPage > 1 && <label onClick={() => setNumberPage(pre => pre - 1)} className='btn-paging unseleted'>
                            <AiOutlineLeft />
                        </label>}
                        {numberOfPages.map((item) => (
                            <label className={`btn-paging ${numberPage === item ? 'selected-paging' : 'unseleted'}`} onClick={() => setNumberPage(item)}>{item}</label>
                        ))}
                        {numberPage < numberOfPages.length && <label onClick={() => setNumberPage(pre => pre + 1)} className='btn-paging unseleted'>
                            <AiOutlineRight />
                        </label>}
                    </div>
                </div>
            </>
        }
        </>
    )
}

export default memo(HistoryBookingCustomer)