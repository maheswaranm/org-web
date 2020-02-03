import { Map } from 'immutable';
import formatDate from 'date-fns/format';
import _ from 'lodash';

export default (templateString, customVariables = Map()) => {
  if (!templateString) {
    return ['', null];
  }

  const substitutions = {
    '%t': `<${formatDate(new Date(), 'yyyy-MM-dd eee')}>`,
    '%T': `<${formatDate(new Date(), 'yyyy-MM-dd eee HH:mm')}>`,
    '%u': `[${formatDate(new Date(), 'yyyy-MM-dd eee')}]`,
    '%U': `[${formatDate(new Date(), 'yyyy-MM-dd eee HH:mm')}]`,
  };

  customVariables.entrySeq().forEach(([key, value]) => {
    substitutions[`%${key}`] = value;
  });

  let substitutedString = templateString;
  _.entries(substitutions).forEach(
    ([formatString, value]) =>
      (substitutedString = substitutedString.replace(RegExp(formatString, 'g'), value))
  );

  const cursorIndex = substitutedString.includes('%?') ? substitutedString.indexOf('%?') : null;
  substitutedString = substitutedString.replace(/%\?/, '');

  return [substitutedString, cursorIndex];
};
