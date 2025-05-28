import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Visual = () => {
    const [byDonor, setByDonor] = useState({});
    const [byCoinType, setByCoinType] = useState({});
    const [byEvent, setByEvent] = useState({});
    const { token } = useSelector((state) => state.token);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [dataArry, setDataArry] = useState([]);

    // שליפת נתונים מהשרת
    useEffect(() => {
        const fetchData = async () => {
            const documentStyle = getComputedStyle(document.documentElement);
            try {
                const response = await axios.get('http://localhost:1135/api/donation', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const sumCoin = sumByField(response.data, 'coinType');
                const sumEvent = sumByField(response.data, 'event');

                setByDonor({
                    labels: ['seminary', 'private'],
                    datasets: [{
                        data: ress(response.data),
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500')
                        ]
                    }]
                });

                setByCoinType({
                    labels: Object.keys(sumCoin),
                    datasets: [{
                        data: Object.values(sumCoin),
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--teal-500'),
                            documentStyle.getPropertyValue('--red-500'),
                            documentStyle.getPropertyValue('--pink-500'),
                            documentStyle.getPropertyValue('--lightblue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--orange-500'),
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--purple-500'),
                            documentStyle.getPropertyValue('--cyan-500'),
                            documentStyle.getPropertyValue('--indigo-500'),
                            documentStyle.getPropertyValue('--lime-500'),
                            documentStyle.getPropertyValue('--amber-500'),
                            documentStyle.getPropertyValue('--brown-500'),
                            documentStyle.getPropertyValue('--gray-500')
                        ]
                    }]
                });

                setByEvent({
                    labels: Object.keys(sumEvent),
                    datasets: [{
                        data: Object.values(sumEvent),
                        backgroundColor: [
                            documentStyle.getPropertyValue('--blue-500'),
                            documentStyle.getPropertyValue('--yellow-500'),
                            documentStyle.getPropertyValue('--red-500'),
                            documentStyle.getPropertyValue('--pink-500'),
                            documentStyle.getPropertyValue('--lightblue-500'),
                            documentStyle.getPropertyValue('--orange-500'),
                            documentStyle.getPropertyValue('--green-500'),
                            documentStyle.getPropertyValue('--purple-500'),
                            documentStyle.getPropertyValue('--teal-500'),
                            documentStyle.getPropertyValue('--cyan-500'),
                            documentStyle.getPropertyValue('--indigo-500'),
                            documentStyle.getPropertyValue('--lime-500'),
                            documentStyle.getPropertyValue('--amber-500'),
                            documentStyle.getPropertyValue('--brown-500'),
                            documentStyle.getPropertyValue('--gray-500')
                        ]
                    }]
                });

                setDataArry(response.data);

            } catch (err) {
                console.log(err);
            }
        };
        if (token) fetchData();
    }, [token]);

    // בניית נתוני גרף עמודות לאחר שליפת הנתונים
    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const data = {
            labels: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            datasets: [
                {
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: getData(dataArry)
                }
            ]
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: false // זה יעלים את המלבן התכלת עם undefined!
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };

        setChartData(data);
        setChartOptions(options);
    }, [dataArry]);

    // פונקציות עזר
    const sumByField = (data, field) => {
        const result = {};
        data.forEach(item => {
            const key = item[field];
            if (!result[key]) result[key] = 0;
            result[key] += Number(item.donationAmount) || 0;
        });
        return result;
    };

    const ress = (data) => {
        const seminarySum = [0, 0];
        data.forEach(item => {
            if (item.donorId && item.donorId.name && (item.donorId.name).includes("seminary")) {
                seminarySum[0] += Number(item.donationAmount) || 0;
            } else {
                seminarySum[1] += Number(item.donationAmount) || 0;
            }
        });
        return seminarySum;
    };

    const getData = (data) => {
        const monthlyData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        data.forEach(item => {
            if (item.donationDate) {
                const date = new Date(item.donationDate);
                const month = date.getMonth();
                monthlyData[month] += Number(item.donationAmount) || 0;
            }
        });
        return monthlyData;
    };

    return (
        <>
            <div className="card flex gap-4" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <Chart type="pie" data={byDonor} options={{}} className="w-full md:w-30rem" />
                <Chart type="pie" data={byCoinType} options={{}} className="w-full md:w-30rem" />
                <Chart type="pie" data={byEvent} options={{}} className="w-full md:w-30rem" />
            </div>
            <Chart type="bar" data={chartData} options={chartOptions} />
        </>
    );
};

export default Visual;