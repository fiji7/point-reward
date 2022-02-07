import { month } from './constants';

export function calculatePoints(price) {
    let points = 0;
    price = Math.floor(price);

    points = 50 < price && price < 100 ? price - 50 : points;
    points = price > 100 ? 50 + 2 * (price - 100) : points;

    return points;
}


export const getMonthsBack = (initialDate, monthsToGoBack) => {
    let initialDateObject = new Date(initialDate);
    let clonedInitialDate = new Date(+initialDateObject);
    let initialMonth = initialDateObject.getMonth();

    monthsToGoBack = initialMonth - monthsToGoBack;

    let movedDate = clonedInitialDate.setMonth(monthsToGoBack);
    let monthsInRange = [];

    for (let i = monthsToGoBack + 1; i <= initialMonth; i++) {
        monthsInRange.push(month[i]);
    }
    return [initialDateObject, movedDate, monthsInRange];
};

export const getMonth = (monthIndex) => month[monthIndex];

export const filterDates = (
    transactionData,
    initialDate,
    movedDate,
    monthsInRange
) => {
    let customerData = {};
    let monthsDataTemplate = monthsInRange.map((month) => ({
        month,
        amount: 0,
    }));
    transactionData.forEach((data) => {
        let transactionDate = new Date(data.date);
        let transactionTime = transactionDate.getTime();

        if (
            transactionTime >= movedDate &&
            transactionTime <= initialDate.getTime()
        ) {
            let name = data.customer.name;

            const monthMapper = (array) => {
                let month = getMonth(transactionDate.getMonth());
                return array.map((monthData) => {
                    if (monthData.month === month) {
                        return {
                            ...monthData,
                            amount:
                                monthData.amount + calculatePoints(data.amount),
                        };
                    }

                    return monthData;
                });
            };

            if (!customerData[name]) {
                customerData = {
                    ...customerData,
                    [name]: {
                        name,
                        customerId: data.customer.customerId,
                        months: monthMapper(monthsDataTemplate),
                        amount: calculatePoints(data.amount),
                    },
                };
            } else {
                customerData = {
                    ...customerData,
                    [name]: {
                        ...customerData[name],
                        months: monthMapper(customerData[name].months),
                        amount:
                            calculatePoints(data.amount) +
                            customerData[name].amount,
                    },
                };
            }
        }
    });
    return customerData;
};
