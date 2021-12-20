import {helpers} from 'vuelidate/lib/validators'


// eslint-disable-next-line no-control-regex
export const uniAlpha = helpers.regex("uniAlpha", /^([^\u0000-\u007F]|[A-Za-z])+$/);