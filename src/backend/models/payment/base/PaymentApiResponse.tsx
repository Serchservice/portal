interface IPaymentApiResponse<T> {
    total: number;
    transactions: T[];
    status: string;
    title: string;
}

export class PaymentApiResponse<T> implements IPaymentApiResponse<T> {
    total: number;
    status: string;
    title: string;
    transactions: T[];

    constructor(data: Partial<IPaymentApiResponse<T>> = {}) {
        this.total = data.total || 0;
        this.status = data.status || '';
        this.title = data.title || '';
        this.transactions = data.transactions || [];
    }

    /**
     * Creates a new instance of `PaymentApiResponse` with the specified changes.
     * Allows for partial updates, keeping the original values for unspecified fields.
     *
     * @param total The total number of transactions (optional).
     * @param transactions The list of transactions (optional).
     * @returns A new `PaymentApiResponse` instance with the updated fields.
     */
    copyWith(data: Partial<IPaymentApiResponse<T>>): PaymentApiResponse<T> {
        return new PaymentApiResponse({
            total: data.total !== undefined ? data.total : this.total,
            status: data.status !== undefined ? data.status : this.status,
            title: data.title !== undefined ? data.title : this.title,
            transactions: data.transactions !== undefined ? data.transactions : this.transactions
        });
    }

    /**
     * Serializes the `PaymentApiResponse` instance to a JSON object.
     *
     * @returns A JSON representation of the `PaymentApiResponse`.
     */
    toJson(): any {
        return {
            total: this.total,
            status: this.status,
            title: this.title,
            transactions: this.transactions
        };
    }

    /**
     * Deserializes a JSON object to create an instance of `PaymentApiResponse`.
     *
     * @param json The JSON object containing `total` and `transactions` fields.
     * @returns A new `PaymentApiResponse` instance created from the JSON data.
     */
    static fromJson<T>(json: any): PaymentApiResponse<T> {
        return new PaymentApiResponse({
            total: json.total || 0,
            status: json.status || '',
            title: json.title || '',
            transactions: json.transactions || []
        });
    }
}