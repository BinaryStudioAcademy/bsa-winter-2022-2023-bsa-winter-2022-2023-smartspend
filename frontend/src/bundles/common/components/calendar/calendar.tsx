import React from 'react';


import { OneDayCalendar, RangeCalendar } from './components/components.js';
import styles from './styles.module.scss';

type Properties = {
    isRangeCalendar: boolean;
};

const Calendar: React.FC<Properties> = ({ isRangeCalendar }: Properties) => {
    const isRangeView: boolean = isRangeCalendar;

    return <>{isRangeView ? <RangeCalendar /> : <OneDayCalendar />}</>;
};

export { Calendar };
