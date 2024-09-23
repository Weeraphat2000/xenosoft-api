import { schema, Typesaurus } from 'typesaurus';
import { User } from '../model/user.interface';

export const db = schema(($) => ({
  users: $.collection<User>(),
}));

export type Schema = Typesaurus.Schema<typeof db>;
