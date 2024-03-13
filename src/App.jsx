import React, { useState, useEffect } from "react";
import "./App.css";
import DataSourceEndpoint from "./DataSourceEndpoint";

function App() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataItems, setDataItems] = useState([]);
    const [sliderPosition, setSliderPosition] = useState(0);
    const [nextItems, setNextItems] = useState([]);

    const dataSource = new DataSourceEndpoint();

    useEffect(() => {
        const initialDataItems = dataSource.getNextDataItems(10);
        setDataItems(initialDataItems);
        setCurrentIndex(0);
//next images
        const nextItemsSlice = initialDataItems.slice(1, 6);
        setNextItems(nextItemsSlice);
    }, []);

    useEffect(() => {
        const newPosition = -currentIndex * (600 + 10);
        setSliderPosition(newPosition);
    }, [currentIndex]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            const prevItemsSlice = dataItems.slice(
                prevIndex + 1,
                prevIndex + 6
            );
            setNextItems(prevItemsSlice);
            setCurrentIndex(prevIndex);
        }
    };

    const handleNext = () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= dataItems.length - 6) {
            const newItems = dataSource.getNextDataItems(5);
            setDataItems((prevItems) => [...prevItems, ...newItems]);
        }

        const nextItemsSlice = dataItems.slice(nextIndex + 1, nextIndex + 6);
        setNextItems(nextItemsSlice);

        setCurrentIndex(nextIndex);
    };

    console.log("Data =>", dataItems);

    return (
        <div className="slider-wrapper">
            <div className="slider-container">
                <div
                    className="slider-box"
                    style={{ transform: `translateX(${sliderPosition}px)` }}
                >
                    {dataItems.map((item, index) => (
                        <div
                            key={index}
                            className={`slide ${
                                currentIndex === index ? "active" : ""
                            }`}
                        >
                            <img src={item.url} alt={`Pic ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="next-items-container">
                {nextItems.map((item, index) => (
                    <div key={index} className="next-item">
                        <img src={item.url} alt={`Next Pic ${index + 1}`} />
                    </div>
                ))}
            </div>
            <button
                className="prev"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
            >
                Prev
            </button>
            <button className="next" onClick={handleNext}>
                Next
            </button>
        </div>
    );
}

export default App;
