/**
* This file is auto-generated by nestjs-proto-gen-ts
*/

import { Metadata } from '@grpc/grpc-js';

export interface ICustomersService {
    find(
        data: ProductId,
        metadata?: Metadata,
        ...rest: any[]
    ): Promise<Recipe>;
    getAllNews(
        data: Empty,
        metadata?: Metadata,
        ...rest: any[]
    ): Promise<NewsList>;
}
export interface News {
    id?: string;
    title?: string;
    body?: string;
    postImage?: string;
}
// tslint:disable-next-line:no-empty-interface
export interface Empty {
}
export interface NewsList {
    news?: News[];
}
export interface ProductId {
    id?: number;
}
export interface Recipe {
    id?: number;
    title?: string;
    notes?: string;
}

