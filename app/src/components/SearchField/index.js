import React, { PropTypes } from 'react';
import { Textfield } from 'react-mdl';
import classNames from 'classnames';
import { translate } from 'react-i18next';

require('./search-field.scss');

function SearchField({
  width,
  onChange = {},
  darkBackground,
  disabled = false,
  t,
}) {
  const classes = classNames({
    'search-container': true,
    'dark-container': darkBackground,
  });

  return (
    <div className={classes} style={{ width }}>
      <i className="material-icons">search</i>
      <Textfield
        onChange={onChange}
        label={t('search')}
        style={{ width: width - 45 }}
        disabled={disabled}
      />
    </div>
  );
}

SearchField.propTypes = {
  width: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  darkBackground: PropTypes.bool,
  disabled: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

export default translate('common')(SearchField);
