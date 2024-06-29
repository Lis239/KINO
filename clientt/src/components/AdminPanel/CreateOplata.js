import React, {useContext, useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import Modal from "react-bootstrap/Modal";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import {createBilet} from "../../http/blietAPI";
import {Context} from "../../index";
import {buyBron} from "../../http/bronAPI";


const CreateOplata  = observer(({loc,show, onHide,kode,id}) => {
    const {bron,bilet}=useContext(Context)
    const [VISib,setVIS]=useState(false)
    const [MSG,setMSG]=useState(false)
    const [CardType,setCardType]=useState("Не определена")
    const iscreate=loc==='create'
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        setValue
    }=useForm({mode:"onBlur"});
    const EXIT=()=>{
        setValue('number',"")
        setValue('mm', "")
        setValue('yy', "")
        setValue('name', "")
        setValue('cvc', "")

        reset()
        onHide()
    }

    const cteateBrontoBilet= async (data) => {
        let formData=new FormData()
        formData.append('number', data.number)
        formData.append('mm', data.mm)
        formData.append('yy', data.yy)
        formData.append('name', data.name)
        formData.append('cvc', data.cvc)
        formData.append('kode', kode)

       // for (let [key, value] of formData) {
        //    console.log(`${key} - ${value}`)
        //}
        try {
            let bronn = await buyBron(id,formData)
            setVIS(true)
            if (bronn.isCode === 200) {
                bron.setTriger(!bron.getTriger)
                setMSG('Данные сохранены')
            }
            if (bronn.isCode !== 200) {
                setMSG(bronn.getmsg)
            }
        } catch (e) {
            setVIS(true)
            setMSG(e?.response?.data?.message)
        }



    }
    const cteateBilet= async (data) => {

        let formData=bilet.getformData
        formData.append('number', data.number)
        formData.append('mm', data.mm)
        formData.append('yy', data.yy)
        formData.append('name', data.name)
        formData.append('cvc', data.cvc)

        //for (let [key, value] of formData) {
        //    console.log(`${key} - ${value}`)
        //}
        try {
        let bilett = await createBilet(formData)
        setVIS(true)
        if (bilett.isCode === 200) {
            bilet.setTriger(!bilet.getTriger)
            setMSG('Данные сохранены')
        }
        if (bilett.isCode !== 200) {
            setMSG(bilett.getmsg)
        }
    } catch (e) {
        setVIS(true)
        setMSG(e?.response?.data?.message)
    }

    }

    function getUpperCase(e) {
        setValue("name",e.target.value.toUpperCase())
    }
    function getCardType(e) {
        let num=e.target.value

        if (num.match(/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/)) {
            setCardType('MasterCard')
        }
        if (num.match(/^4[0-9]{0,}$/) && num.match(/^4\d{12}/)) {
            setCardType('Visa')
        }
       // if (num.match(/^(220|221|222)[0-9]{0,}/)) {
        if (num.match(/^(?:220[0-4])\d$/)) {
            setCardType('МИР');
        }

    }
    useEffect(() => {
        setVIS(false)
    },  [show])

return(

    <Modal
        show={show}
        onHide={onHide}
        centered
        size="lg"
    >
        <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
               Форма оплаты
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { VISib ?
                <div className="m-auto" style={{color:"red"}}>{MSG} <Button  style={{width:30,height:30,padding:0}} variant={"outline-success"}
                                                                             onClick={()=> setVIS(false)}>X</Button></div>
                : <div className="m-auto" style={{color: "white"}}/>
            }
            <Row>

                <Row className="mt-2">
                    <Col>
                    <Row> <Col>Тип Карты {CardType} </Col></Row>
                    <Form.Control type="tel"
                        {...register("number",{
                            required: "Данное поле необходимо заполнить",
                                pattern: {
                                    value: /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
                                    message: "Неверный формат ввода"
                                }
                        }

                        )}
                        className="mt-3"
                        control={control}
                        placeholder="Номер карты"
                        onChange={getCardType}
                        onPaste={getCardType}
                        onCut={getCardType}
                        onInsert={getCardType}
                                  onKeyPress={(event) => {
                                      if (!/^[0-9\b]+$/.test(event.key)) {
                                          event.preventDefault();
                                      }
                                  }}
                    />
                    <>{errors?.number && <p>{errors?.number?.message||"Ошибка"}</p>}</>
                    </Col>
                </Row>

                <Row className="mt-2">
                <Col>
                    <Form.Control type="text"
                                  {...register("name",{
                                          required: "Данное поле необходимо заполнить",
                                      }
                                  )}
                                  className="mt-3"
                                  control={control}
                                  placeholder="Фамилия Имя"
                                  onChange={getUpperCase}
                                  onKeyPress={(event) => {
                                      if (!/^[a-zA-Z\b]+$/.test(event.key)) {
                                          event.preventDefault();
                                      }
                                  }}
                    />
                    <>{errors?.name && <p>{errors?.name?.message||"Ошибка"}</p>}</>
                </Col>
                </Row>
                <Row className="mt-2">
                    <Col>

                        <Row>
                            <Col className="mt-3  pe-1" style={{maxWidth:"100px"}}>
                        <Form.Control type="tel"
                                      style={{maxWidth:"100px"}}
                                      {...register("mm",{
                                              required: "Данное поле необходимо заполнить",
                                          max:{
                                              value: 12,
                                              message:"Месяц может быть от 1 до 12"
                                          },
                                          min:{
                                                  value: 1,
                                                  message:"Месяц может быть от 1 до 12"
                                          }

                                          }
                                      )}
                                      maxLength={2}
                                      className="pe-1"
                                      control={control}
                                      placeholder="Месяц"
                                      onKeyPress={(event) => {
                                          if ((!/^[0-9\b]$/.test(event.key))) {
                                              event.preventDefault();
                                          }
                                      }}
                        />
                                <>{errors?.mm && <p>{errors?.mm?.message||"Ошибка"}</p>}</>

                            </Col>
                            <Col className="mt-3 ps-2 pe-2" style={{maxWidth:10}}> /</Col>
                            <Col className="mt-3 ps-1 " style={{maxWidth:"100px"}}>
                    <Form.Control type="tel"
                                  style={{maxWidth:"100px"}}
                                        {...register("yy",{
                                                required: "Данное поле необходимо заполнить",
                                            }
                                        )}
                                        maxLength={2}
                                        className="ps-1"
                                        control={control}
                                        placeholder="Год"
                                        onKeyPress={(event) => {
                                            if ((!/^[0-9\b]$/.test(event.key))) {
                                                event.preventDefault();
                                            }
                                        }}
                    />
                                <>{errors?.yy && <p>{errors?.yy?.message||"Ошибка"}</p>}</>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row  className="jasty">
                            <Form.Control type="password"
                                          style={{maxWidth:"100px"}}
                                          {...register("cvc",{
                                                  required: "Данное поле необходимо заполнить",


                                              }
                                          )}
                                          maxLength={3}
                                          className="mt-3 ps-1"
                                          control={control}
                                          placeholder="cvc"
                                          onKeyPress={(event) => {
                                              if ((!/^[0-9\b]$/.test(event.key))) {
                                                  event.preventDefault();
                                              }
                                          }}
                            />
                            <>{errors?.cvc && <p>{errors?.cvc?.message||"Ошибка"}</p>}</>
                        </Row>
                    </Col>
                </Row>

            </Row>
        </Modal.Body>
        <Modal.Footer>
            {iscreate ?
                <Button onClick={handleSubmit(cteateBilet)} type="submit" variant="outline-danger">Оплатить</Button>
                :
                <Button onClick={handleSubmit(cteateBrontoBilet)} type="submit" variant="outline-danger">Оплатить бронирование</Button>
            }

            <Button   variant="outline-danger" onClick={EXIT}>Закрыть</Button>
        </Modal.Footer>
    </Modal>
)
})


export default CreateOplata;