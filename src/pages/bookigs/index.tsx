/** @format */

import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch";
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook";
import { useEffect } from "react";

export default function Bookings() {
  const { getBookings } = UseTypedDispatch();
  const bookings = useTypedSelectorHook((state) => state.tours.bookings);

  const { getTours } = UseTypedDispatch();
  const tours = useTypedSelectorHook((state) => state.tours.tours);

  const authData = localStorage.getItem("pocketbase_auth");

  const userId = JSON.parse(authData);

  const sortedTours = tours.items?.filter(
    (el) => el.guide_id === userId.userId
  );
  const sortedBookings = bookings.filter((booking) =>
    sortedTours.some((tour) => tour.id === booking.tour_id)
  );

  useEffect(() => {
    getTours();
    getBookings();
  }, []);
  useEffect(() => {
    getTours();
    getBookings();
  }, []);

  const changeBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateBooking({ id: bookingId, current_state: newStatus });

      getBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <div>
      <h1>Bookings</h1>
      {bookings?.map((el) => (
        <div key={el.id}>{el.id}</div>
      ))}

      <button
        onClick={() => {
          console.log(
            "sortedTours",
            sortedTours.flatMap((el) => el.id)
          );
          console.log("sortedBookings", sortedBookings);
          console.log("bookings", bookings);
        }}
      ></button>

      {sortedBookings?.map((el) => (
        <div
          style={{
            background: "red",
            width: "200px",
            height: "100px",
          }}
          key={el.id}
        >
          <h3>{el.username}</h3>
          <p>{el.additionalText}</p>
          <p>{el.current_state}</p>
        </div>
      ))}
    </div>
  );
}
