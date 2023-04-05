import { type IEntity } from '~/common/interfaces/entity.interface.js';

class TransactionEntity implements IEntity {
    private 'id': string | null;

    private 'categoryId': string;

    private 'date': Date;

    private 'note': string;

    private 'label': string;

    private 'amount': number;

    private 'currencyId'?: string;

    private 'ownerId': string;

    private constructor({
        id,
        categoryId,
        date,
        note,
        label,
        amount,
        currencyId,
        ownerId,
    }: {
        id: string | null;
        categoryId: string;
        date: Date;
        note: string;
        label: string;
        amount: number;
        currencyId?: string;
        ownerId: string;
    }) {
        this.id = id;
        this.categoryId = categoryId;
        this.date = date;
        this.note = note;
        this.label = label;
        this.amount = amount;
        this.currencyId = currencyId;
        this.ownerId = ownerId;
    }

    public static initialize({
        id,
        categoryId,
        date,
        note,
        label,
        amount,
        currencyId,
        ownerId,
    }: {
        id: string | null;
        categoryId: string;
        date: Date;
        note: string;
        label: string;
        amount: number;
        currencyId?: string;
        ownerId: string;
    }): TransactionEntity {
        return new TransactionEntity({
            id,
            categoryId,
            date,
            note,
            label,
            amount,
            currencyId,
            ownerId,
        });
    }

    public static initializeNew({
        categoryId,
        date,
        note,
        label,
        amount,
        currencyId,
        ownerId,
    }: {
        categoryId: string;
        date: Date;
        note: string;
        label: string;
        amount: number;
        currencyId?: string;
        ownerId: string;
    }): TransactionEntity {
        return new TransactionEntity({
            id: null,
            categoryId,
            date,
            note,
            label,
            amount,
            currencyId,
            ownerId,
        });
    }

    public toObject(): {
        id: string;
        categoryId: string;
        date: Date;
        note: string;
        label: string;
        amount: number;
        currencyId?: string;
        ownerId: string;
    } {
        return {
            id: this.id as string,
            categoryId: this.categoryId,
            date: this.date,
            note: this.note,
            label: this.label,
            amount: this.amount,
            currencyId: this.currencyId,
            ownerId: this.ownerId,
        };
    }

    public toNewObject(): {
        categoryId: string;
        date: Date;
        note: string;
        label: string;
        amount: number;
        currencyId?: string;
        ownerId: string;
    } {
        return {
            categoryId: this.categoryId,
            date: this.date,
            note: this.note,
            label: this.label,
            amount: this.amount,
            currencyId: this.currencyId,
            ownerId: this.ownerId,
        };
    }
}

export { TransactionEntity };
