import { type Range } from 'react-date-range';
import {
    type CategoryGetAllItemResponseDto,
    type TransactionGetAllItemResponseDto,
    type WalletGetAllItemResponseDto,
} from 'shared/build';

import { type DataObject } from '~/bundles/common/types/chart-data.type';
import { type DataType } from '~/bundles/common/types/dropdown.type';

const DEFAULT_FILTER_CATEGORIES = [
    {
        date: '',
        total: 100,
        color: 'linear-gradient(95.5deg, #284B9F 0%, #102E68 100%)',
    },
];

type OneData = { date: string; value: number };
type DataRangeObject = { label: string; data: OneData[] };
type DataTotalObjects = { date: string; total: number; color: string }[];
type BarChartData = {
    label: string;
    data: {
        date: string;
        value: number;
    }[];
}[];
type DoughnutData = {
    date: string;
    total: number;
    color: string;
}[];

const filterLineChart = (range: Range, data: DataObject[]): DataObject[] => {
    const startDate: Date | undefined = range.startDate;
    const endDate: Date | undefined = range.endDate;
    return data.filter(
        (date) =>
            startDate &&
            new Date(date.date) >= startDate &&
            endDate &&
            new Date(date.date) <= endDate,
    );
};

const filterChart = (range: Range, data: BarChartData): DataRangeObject[][] => {
    const startDate: Date | undefined = range.startDate;
    const endDate: Date | undefined = range.endDate;
    return data.map(({ label, data }) => {
        const filteredData = data.filter(
            (item: { date: string | number | Date }) => {
                const itemDate = new Date(item.date);
                return (
                    (!startDate || itemDate >= startDate) &&
                    (!endDate || itemDate <= endDate)
                );
            },
        );
        return [{ label, data: filteredData }];
    });
};

const filterCategories = (
    range: Range,
    data: DoughnutData,
): DataTotalObjects => {
    const startDate: Date | undefined = range.startDate;
    const endDate: Date | undefined = range.endDate;
    const result = data.filter(
        (date) =>
            startDate &&
            new Date(date.date) >= startDate &&
            endDate &&
            new Date(date.date) <= endDate,
    );
    if (result.length === 0) {
        return DEFAULT_FILTER_CATEGORIES;
    }
    return result;
};

type WalletCategoryData = {
    value: string;
    name: string;
};

function createCategoryDataArray(
    categories: CategoryGetAllItemResponseDto[],
): DataType[] {
    return categories.map((category) => ({
        value: category.id,
        name: category.name,
    }));
}

const createWalletCategoryDataArray = (
    wallets: WalletGetAllItemResponseDto[],
): WalletCategoryData[] => {
    return wallets.map((wallet) => {
        return { value: wallet.name, name: wallet.name };
    });
};

const calculateLineChartData = (
    transactions: TransactionGetAllItemResponseDto[],
): DataObject[] => {
    const calculatedData: DataObject[] = [];
    for (const transaction of transactions) {
        const date = new Date(transaction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
        calculatedData.push({ date, value: transaction.amount });
    }
    return calculatedData.sort((a, b) => +new Date(a.date) - +new Date(b.date));
};

const groupTransactionsByDate = (
    transactions: TransactionGetAllItemResponseDto[],
): BarChartData => {
    const groups: Record<string, { income: number; outcome: number }> = {};

    for (const transaction of transactions) {
        const date = new Date(transaction.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });

        groups[date] = { income: 0, outcome: 0 };

        if (transaction.amount > 0) {
            groups[date].income += transaction.amount;
        } else {
            groups[date].outcome += Math.abs(transaction.amount);
        }
    }

    const sortedDates = Object.keys(groups).sort((a, b) => {
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return dateA - dateB;
    });

    return [
        {
            label: 'income',
            data: sortedDates.map((date) => ({
                date,
                value: groups[date].income,
            })),
        },
        {
            label: 'outcome',
            data: sortedDates.map((date) => ({
                date,
                value: groups[date].outcome,
            })),
        },
    ];
};

interface ProcessedTransaction {
    date: string;
    total: number;
    color: string;
}

interface ProcessedTransactions {
    positiveResult: ProcessedTransaction[];
    negativeResult: ProcessedTransaction[];
}

type GradientMap = Record<string, string>;

const findOrCreateItem = ({
    result,
    date,
    amount,
    gradient,
}: {
    result: ProcessedTransaction[];
    date: string;
    amount: number;
    gradient: string;
}): void => {
    const existing = result.find((item) => item.date.toString() === date);

    if (existing) {
        existing.total += amount;
    } else {
        result.push({
            date: date,
            total: amount,
            color: gradient,
        });
    }
};

const processTransactions = (
    transactions: TransactionGetAllItemResponseDto[],
): ProcessedTransactions => {
    const gradientMap: GradientMap = {};
    let negativeTotal = 0;
    const positiveResult: ProcessedTransaction[] = [];
    const negativeResult: ProcessedTransaction[] = [];

    for (const current of transactions) {
        const categoryId = current.categoryId;
        let gradient = gradientMap[categoryId];

        if (!gradient) {
            // eslint-disable-next-line unicorn/number-literal-case
            const randomColor1 = Math.floor(Math.random() * 0xff_ff_ff)
                .toString(16)
                .padStart(6, '0');
            // eslint-disable-next-line unicorn/number-literal-case
            const randomColor2 = Math.floor(Math.random() * 0xff_ff_ff)
                .toString(16)
                .padStart(6, '0');
            const randomStop1 = Math.floor(Math.random() * 30);
            gradient = `linear-gradient(95.5deg, #${randomColor1} ${randomStop1}, #${randomColor2} 100%)`;
            gradientMap[categoryId] = gradient;
        }

        if (current.amount >= 0) {
            findOrCreateItem({
                result: positiveResult,
                date: current.date.toString(),
                amount: current.amount,
                gradient,
            });
        } else {
            negativeTotal += current.amount;
            findOrCreateItem({
                result: negativeResult,
                date: current.date.toString(),
                amount: current.amount,
                gradient,
            });
        }
    }

    if (negativeTotal !== 0 && negativeResult.length === 0) {
        negativeResult.push({
            date: '',
            total: negativeTotal,
            color: 'linear-gradient(95.5deg, #ff0000 0%, #ff6666 100%)',
        });
    }

    return { positiveResult, negativeResult };
};
type TransactionType = 'income' | 'expense';

const getTotalPeriodAmount = (
    transactions: TransactionGetAllItemResponseDto[],
    type: TransactionType,
): number => {
    const filteredTransactions = transactions.filter((transaction) =>
        type === 'income' ? transaction.amount < 0 : transaction.amount > 0,
    );

    const total = filteredTransactions.reduce((accumulator, transaction) => {
        return accumulator + transaction.amount;
    }, 0);

    return Math.abs(total);
};

export {
    calculateLineChartData,
    createCategoryDataArray,
    createWalletCategoryDataArray,
    filterCategories,
    filterChart,
    filterLineChart,
    getTotalPeriodAmount,
    groupTransactionsByDate,
    processTransactions,
};
