import express from 'express';

export interface IRouter extends express.Router {}
export interface IRequest extends express.Request {
	user?: any;
}
export interface IResponse extends express.Response {}
export interface INext extends express.NextFunction {}