import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';

import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';

import { Field, Form, Formik } from 'formik';
import FormField from '../../components/FormField';
import BaseDivider from '../../components/BaseDivider';
import BaseButtons from '../../components/BaseButtons';
import BaseButton from '../../components/BaseButton';
import FormCheckRadio from '../../components/FormCheckRadio';
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup';
import FormFilePicker from '../../components/FormFilePicker';
import FormImagePicker from '../../components/FormImagePicker';
import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { SwitchField } from '../../components/SwitchField';
import { RichTextField } from '../../components/RichTextField';

import { update, fetch } from '../../stores/fileds/filedsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { saveFile } from '../../helpers/fileSaver';
import dataFormatter from '../../helpers/dataFormatter';
import ImageField from '../../components/ImageField';

const EditFileds = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initVals = {
    ['stringfield']: '',

    boolfield: false,

    datetime: new Date(),

    ['demical']: '',

    intfield: '',

    enumfield: '',

    enumfieldselect: '',

    datefield: new Date(),

    imagesfield: [],

    filedfield: [],

    relationonefield: '',

    relationmanyfield: [],
  };
  const [initialValues, setInitialValues] = useState(initVals);

  const { fileds } = useAppSelector((state) => state.fileds);

  const { filedsId } = router.query;

  useEffect(() => {
    dispatch(fetch({ id: filedsId }));
  }, [filedsId]);

  useEffect(() => {
    if (typeof fileds === 'object') {
      setInitialValues(fileds);
    }
  }, [fileds]);

  useEffect(() => {
    if (typeof fileds === 'object') {
      const newInitialVal = { ...initVals };

      Object.keys(initVals).forEach((el) => (newInitialVal[el] = fileds[el]));

      setInitialValues(newInitialVal);
    }
  }, [fileds]);

  const handleSubmit = async (data) => {
    await dispatch(update({ id: filedsId, data }));
    await router.push('/fileds/fileds-list');
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit fileds')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title={'Edit fileds'}
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>
              <FormField label='String field'>
                <Field name='stringfield' placeholder='Your String field' />
              </FormField>

              <FormField label='Bool field' labelFor='boolfield'>
                <Field
                  name='boolfield'
                  id='boolfield'
                  component={SwitchField}
                ></Field>
              </FormField>

              <FormField label='Datetime'>
                <DatePicker
                  dateFormat='yyyy-MM-dd hh:mm'
                  showTimeSelect
                  selected={
                    initialValues.datetime
                      ? new Date(
                          dayjs(initialValues.datetime).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, datetime: date })
                  }
                />
              </FormField>

              <FormField label='Demical'>
                <Field
                  type='number'
                  name='demical'
                  placeholder='Your Demical'
                />
              </FormField>

              <FormField label='Int field'>
                <Field
                  type='number'
                  name='intfield'
                  placeholder='Your Int field'
                />
              </FormField>

              <FormField label='Enum field'>
                <FormCheckRadioGroup>
                  <FormCheckRadio type='radio' label='1'>
                    <Field type='radio' name='enumfield' value='1' />
                  </FormCheckRadio>

                  <FormCheckRadio type='radio' label='2'>
                    <Field type='radio' name='enumfield' value='2' />
                  </FormCheckRadio>
                </FormCheckRadioGroup>
              </FormField>

              <FormField label='Enum field select' labelFor='enumfieldselect'>
                <Field
                  name='Enum field select'
                  id='Enum field select'
                  component='select'
                >
                  <option value='1'>1</option>

                  <option value='2'>2</option>
                </Field>
              </FormField>

              <FormField label='Date field'>
                <DatePicker
                  dateFormat='yyyy-MM-dd'
                  selected={
                    initialValues.datefield
                      ? new Date(
                          dayjs(initialValues.datefield).format(
                            'YYYY-MM-DD hh:mm',
                          ),
                        )
                      : null
                  }
                  onChange={(date) =>
                    setInitialValues({ ...initialValues, datefield: date })
                  }
                />
              </FormField>

              <FormField>
                <Field
                  label='Images field'
                  color='info'
                  icon={mdiUpload}
                  path={'fileds/imagesfield'}
                  name='imagesfield'
                  id='imagesfield'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormImagePicker}
                ></Field>
              </FormField>

              <FormField>
                <Field
                  label='Filed field'
                  color='info'
                  icon={mdiUpload}
                  path={'fileds/filedfield'}
                  name='filedfield'
                  id='filedfield'
                  schema={{
                    size: undefined,
                    formats: undefined,
                  }}
                  component={FormFilePicker}
                ></Field>
              </FormField>

              <FormField label='Relation one field' labelFor='relationonefield'>
                <Field
                  name='relationonefield'
                  id='relationonefield'
                  component={SelectField}
                  options={initialValues.relationonefield}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <FormField
                label='Relation many field'
                labelFor='relationmanyfield'
              >
                <Field
                  name='relationmanyfield'
                  id='relationmanyfield'
                  component={SelectFieldMany}
                  options={initialValues.relationmanyfield}
                  itemRef={'users'}
                  showField={'firstName'}
                ></Field>
              </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type='submit' color='info' label='Submit' />
                <BaseButton type='reset' color='info' outline label='Reset' />
                <BaseButton
                  type='reset'
                  color='danger'
                  outline
                  label='Cancel'
                  onClick={() => router.push('/fileds/fileds-list')}
                />
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  );
};

EditFileds.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default EditFileds;
