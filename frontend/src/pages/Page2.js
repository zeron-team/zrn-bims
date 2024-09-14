import React, { useEffect, useState, useContext } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getChartData } from '../services/chartService';
import { AuthContext } from '../context/AuthContext';

const Page2 = () => {
    const [options, setOptions] = useState({});
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        getChartData('page2', token)
            .then(response => {
                const data = response.data;
                setOptions({
                    title: { text: data.title },
                    xAxis: { categories: data.categories },
                    series: [{ data: data.data, type: 'pie' }],
                });
            })
            .catch(error => {
                console.error(error);
            });
    }, [token]);

    return (
        <div>
            <h2>Página 2 - {options.title}</h2>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default Page2;
