/** @format */
import "@/styles/bookingsTourist.scss";
import {
  showErrorToast,
  showSuccessToast,
} from "@/components/common/toaster/customToast";
import pb from "@/lib/pocketbase";
import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch";
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook";
import { useEffect, useState } from "react";
import { FaTimes, FaTrash, FaInfoCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function BookingsTourist() {
  const dispatch = UseTypedDispatch();
  const { getBookings, updateBooking, getTours } = dispatch;
  const bookings = useTypedSelectorHook((state) => state.tours.bookings);
  const tours = useTypedSelectorHook((state) => state.tours.tours);

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const authData = localStorage.getItem("pocketbase_auth");
  const userId = JSON.parse(authData)?.userId;

  const sortedBookings = bookings.filter(
    (booking) => booking.tourist_id === userId
  );

  const filteredBookings = sortedBookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.current_state === filter;
  });

  const deleteBooking = async (bookingId) => {
    try {
      await pb.collection("booking").delete(bookingId);
      showSuccessToast("Бронь ийгиликтүү өчүрүлдү");
      getBookings();
    } catch (error) {
      console.error("Бронду өчүрүүдө ката кетти:", error);
      showErrorToast("Бронду өчүрүүдө ката кетти");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getBookings(), getTours()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getTourInfo = (tourId) => {
    return tours.items?.find((tour) => tour.id === tourId) || null;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "pendingStatus";
      case "confirmed":
        return "confirmedStatus";
      case "canceled":
        return "canceledStatus";
      default:
        return "";
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBooking({ id: bookingId, current_state: newStatus });
      showSuccessToast("Брондун статусу ийгиликтүү өзгөртүлдү");
    } catch (error) {
      console.error("Статусту өзгөртүүдө ката кетти:", error);
      showErrorToast("Статусту өзгөртүүдө ката кетти");
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="bookingsContainer">
      <div className="filterContainer">
        
      </div>
      {filteredBookings.length === 0 ? (
        <p className="noBookings">Брондор табылган жок</p>
      ) : (
        filteredBookings.map((el) => {
          const tourInfo = getTourInfo(el.tour_id);
          return (
            <div key={el.id} className="bookingCard">
              {tourInfo && (
                <>
                  <h2 className="tourTitle">{tourInfo.title}</h2>
                  {tourInfo.images && tourInfo.images[0] && (
                    <Link to={`/tour_details/${tourInfo.id}`}>
                      <img
                        src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${tourInfo.id}/${tourInfo.images[0]}`}
                        alt={tourInfo.title}
                        className="tourImage"
                      />
                    </Link>
                  )}
                </>
              )}
              <p className={`statusText ${getStatusClass(el.current_state)}`}>
                Статус:{" "}
                {el.current_state === "pending"
                  ? "Ожидает подтверждения"
                  : el.current_state === "confirmed"
                  ? "Подтверждено"
                  : "Отменено"}
              </p>
              <div className="buttonGroup">
                <button
                  onClick={() => deleteBooking(el.id)}
                  className="button deleteButton"
                >
                  <FaTrash /> удалить
                </button>
                {el.current_state !== "canceled" && (
                  <button
                    onClick={() => handleStatusChange(el.id, "canceled")}
                    className="button cancelButton"
                  >
                    <FaTimes /> отменить
                  </button>
                )}
                <Link
                  to={`/tour_details/${tourInfo.id}`}
                  className="button detailsButton"
                >
                  <FaInfoCircle /> подробнее
                </Link>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}