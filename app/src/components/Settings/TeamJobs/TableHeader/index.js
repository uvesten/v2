import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';

require('./table-header.scss');

const TableHeader = ({ t }) => (
  <thead>
    <tr className="job-settings-header">
      <th
        className="mdl-data-table__cell--non-numeric col-4"
      >
        { t('jobs') }
      </th>
      <th
        className="mdl-data-table__cell--non-numeric col-1 job-color-header"
      >
        { t('color') }
      </th>
      <th className="mdl-data-table__cell--non-numeric col-1" />
    </tr>
  </thead>
);

TableHeader.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate('common')(TableHeader);
