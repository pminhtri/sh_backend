import { BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '@/error';
import { FailureResponse, Response } from '@/infra';

export class BaseController {
  public OkResult<T>(res: Response, data: T): Response {
    return res.status(200).send({
      statusCode: 200,
      payload: data
    });
  }

  public NoContentResult(res: Response): Response {
    return res.status(204).send();
  }

  public CreatedResult<T>(res: Response, data: T): Response {
    return res.status(201).send({
      statusCode: 201,
      payload: data
    });
  }

  public BadRequestResult(_: Response, error: FailureResponse[]): Response {
    throw new BadRequestError(error);
  }

  public NotFoundResult(_: Response, error: FailureResponse[]): Response {
    throw new NotFoundError(error);
  }

  public UnauthorizedResult(_: Response, error: FailureResponse[]): Response {
    throw new UnauthorizedError(error);
  }

  public ForbiddenResult(_: Response, error: FailureResponse[]): Response {
    throw new ForbiddenError(error);
  }

  public ServerErrorResult(_: Response, error: FailureResponse[]): Response {
    throw new InternalServerError(error);
  }
}
