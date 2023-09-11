import {
  mdiAccount,
  mdiChartTimelineVariant,
  mdiMail,
  mdiUpload,
} from '@mdi/js';
import Head from 'next/head';
import React, { ReactElement } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
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
import { SwitchField } from '../../components/SwitchField';

import { SelectField } from '../../components/SelectField';
import { SelectFieldMany } from '../../components/SelectFieldMany';
import { RichTextField } from '../../components/RichTextField';

import { create } from '../../stores/fileds/filedsSlice';
import { useAppDispatch } from '../../stores/hooks';
import { useRouter } from 'next/router';

const TablesPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (data) => {
    await dispatch(create(data));
    await router.push('/fileds/fileds-list');
  };
  return (
    <>
      <Head>
        <title>{getPageTitle('New Item')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='New Item'
          main
        >
          Breadcrumbs
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            initialValues={{
              stringfield: '',

              boolfield: false,

              datetime: '',

              demical: '',

              intfield: '',

              enumfield: '',

              enumfieldselect: '',

              datefield: '',
              dateDatefield: '',

              imagesfield: [],

              filedfield: [],

              relationonefield: '',

              relationmanyfield: [],
            }}
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
                <Field
                  type='datetime-local'
                  name='datetime'
                  placeholder='Your Datetime'
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
                  name='enumfieldselect'
                  id='enumfieldselect'
                  component='select'
                >
                  <option value='1'>1</option>

                  <option value='2'>2</option>
                </Field>
              </FormField>

              <FormField label='Date field'>
                <Field
                  type='date'
                  name='datefield'
                  placeholder='Your Date field'
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
                  options={[]}
                  itemRef={'users'}
                ></Field>
              </FormField>

              <FormField
                label='Relation many field'
                labelFor='relationmanyfield'
              >
                <Field
                  name='relationmanyfield'
                  id='relationmanyfield'
                  itemRef={'users'}
                  options={[]}
                  component={SelectFieldMany}
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

TablesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default TablesPage;
