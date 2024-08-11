import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch";
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook";
import tourPageStyles from "../../styles/tourPage.module.scss";
const Tours = () => {
  const [currentSort, setCurrentSort] = useState("default");
  const { getTours } = UseTypedDispatch();
  const tours = useTypedSelectorHook((state) => state.tours.tours);

  useEffect(() => {
    getTours();
  }, []);

  const sortTours = useCallback((items: any, sortType: any) => {
    console.log("Sorting tours:", sortType, items); // Debug log
    if (!items || !Array.isArray(items)) return [];
    const itemsCopy = [...items];
    switch (sortType) {
      case "asc":
        return itemsCopy.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "dsc":
        return itemsCopy.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "A-Z":
        return itemsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case "Z-A":
        return itemsCopy.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return itemsCopy;
    }
  }, []);

  const sortedTours = useMemo(() => {
    const sorted = sortTours(tours.items, currentSort);
    console.log("Sorted tours:", sorted); // Debug log
    return sorted;
  }, [tours.items, currentSort, sortTours]);

  useEffect(() => {
    console.log("Current sort:", currentSort); // Debug log
  }, [currentSort]);

  const handleSortChange = (e: { target: { value: any } }) => {
    const newSort = e.target.value;
    console.log("Changing sort to:", newSort); // Debug log
    setCurrentSort(newSort);
  };

  return (
    <div>
      <div>
        <h1>Tours</h1>
      </div>
      <div className={tourPageStyles.toursAndSortWrapper}>
        <div className={tourPageStyles.sortWrapper}>
          <select value={currentSort} onChange={handleSortChange}>
            <option value="default">По умолчанию</option>
            <option value="asc">По возрастанию цены</option>
            <option value="dsc">По убыванию цены</option>
            <option value="A-Z">А-Я</option>
            <option value="Z-A">Я-А</option>
          </select>
        </div>
        <div className={tourPageStyles.toursWrapper}>
          {sortedTours && sortedTours.length > 0 ? (
            sortedTours.map((el) => (
              <Link to={`/tour_details/${el.id}`} key={el.id}>
                <div
                  className={tourPageStyles.tourCard}
                  style={{
                    backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${el.id}/${el.images[0]})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                  }}
                >
                  <h3>{el.title}</h3>
                  <p className={tourPageStyles.price}>Цена: {el.price} сом</p>
                </div>
              </Link>
            ))
          ) : (
            <p>Туры не доступны</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tours;
