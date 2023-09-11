import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { fetch } from '../../stores/users/usersSlice';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';
import LayoutAuthenticated from '../../layouts/Authenticated';
import { getPageTitle } from '../../config';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import SectionMain from '../../components/SectionMain';
import CardBox from '../../components/CardBox';
import BaseButton from '../../components/BaseButton';
import BaseDivider from '../../components/BaseDivider';
import { mdiChartTimelineVariant } from '@mdi/js';
import { SwitchField } from '../../components/SwitchField';
import FormField from '../../components/FormField';

const UsersView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  const { id } = router.query;

  useEffect(() => {
    dispatch(fetch({ id }));
  }, [dispatch, id]);

  return (
    <>
      <Head>
        <title>{getPageTitle('View users')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'View users'}
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>First Name</p>
            <p>{users?.firstName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Last Name</p>
            <p>{users?.lastName}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Phone Number</p>
            <p>{users?.phoneNumber}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>E-Mail</p>
            <p>{users?.email}</p>
          </div>

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Role</p>
            <p>{users?.role ?? 'No data'}</p>
          </div>

          <SwitchField
            field={{ name: 'disabled', value: users?.disabled }}
            form={{ setFieldValue: () => null }}
            disabled
          />

          <div className={'mb-4'}>
            <p className={'block font-bold mb-2'}>Avatar</p>
            {users?.avatar?.length ? (
              <ImageField
                name={'avatar'}
                image={users?.avatar}
                className='w-20 h-20'
              />
            ) : (
              <p>No Avatar</p>
            )}
          </div>

          <>
            <p className={'block font-bold mb-2'}>Fileds Relation one field</p>
            <CardBox
              className='mb-6 border border-gray-300 rounded overflow-hidden'
              hasTable
            >
              <div className='overflow-x-auto'>
                <table>
                  <thead>
                    <tr>
                      <th>String field</th>

                      <th>Bool field</th>

                      <th>Datetime</th>

                      <th>Demical</th>

                      <th>Int field</th>

                      <th>Enum field</th>

                      <th>Enum field select</th>

                      <th>Date field</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.fileds_relationonefield &&
                      Array.isArray(users.fileds_relationonefield) &&
                      users.fileds_relationonefield.map((item: any) => (
                        <tr
                          key={item.id}
                          onClick={() =>
                            router.push(`/fileds/fileds-view/?id=${item.id}`)
                          }
                        >
                          <td data-label='stringfield'>{item.stringfield}</td>

                          <td data-label='boolfield'>
                            {dataFormatter.booleanFormatter(item.boolfield)}
                          </td>

                          <td data-label='datetime'>
                            {dataFormatter.dateTimeFormatter(item.datetime)}
                          </td>

                          <td data-label='demical'>{item.demical}</td>

                          <td data-label='intfield'>{item.intfield}</td>

                          <td data-label='enumfield'>{item.enumfield}</td>

                          <td data-label='enumfieldselect'>
                            {item.enumfieldselect}
                          </td>

                          <td data-label='datefield'>
                            {dataFormatter.dateFormatter(item.datefield)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {!users?.fileds_relationonefield?.length && (
                <div className={'text-center py-4'}>No data</div>
              )}
            </CardBox>
          </>

          <BaseDivider />

          <BaseButton
            color='info'
            label='Back'
            onClick={() => router.push('/users/users-list')}
          />
        </CardBox>
      </SectionMain>
    </>
  );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default UsersView;
