import _ from 'lodash';
import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import classNames from 'classnames';

require('./table-header.scss');

function TableHeader({ columns, t }) {
  return (
    <thead>
      <tr>
        {
          _.map(columns, (column) => {
            const classes = classNames({
              'mdl-data-table__cell--non-numeric': true,
              [`col-${column.colWidth}`]: true,
            });
            const key = `col-header-${column.columnId}`;

            return (
              <th key={key} className={classes}>
                { t(column.translate) }
              </th>);
          })
        }
      </tr>
    </thead>
  );
}

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  t: PropTypes.func.isRequired,
};

export default translate('common')(TableHeader);
