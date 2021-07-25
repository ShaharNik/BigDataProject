/**
*  Predictor for outSection from model/60fa629639339b0478067264
*  Predictive model by BigML - Machine Learning Made Easy
*/
exports.MyBigML_Model_Prediction = function (section, prediction, type, day, hour, isspecial) {
    if (type == null) {
        return 3.33939;
    }
    else if (type=="Private") {
        return 5;
    }
    else if (type!="Private") {
        if (type=="Truck") {
            return 2;
        }
        else if (type!="Truck") {
            if (hour == null) {
                return 3;
            }
            else if (hour > 16) {
                if (prediction == null) {
                    return 3.75;
                }
                else if (prediction > 4.5) {
                    if (isspecial == null) {
                        return 2.66667;
                    }
                    else if (isspecial=="false") {
                        return 2;
                    }
                    else if (isspecial=="true") {
                        return 4;
                    }
                }
                else if (prediction <= 4.5) {
                    if (section == null) {
                        return 4;
                    }
                    else if (section > 4) {
                        return 5;
                    }
                    else if (section <= 4) {
                        if (section > 1) {
                            if (hour > 20) {
                                if (day == null) {
                                    return 2.75;
                                }
                                else if (day > 3) {
                                    return 2;
                                }
                                else if (day <= 3) {
                                    if (day > 1) {
                                        return 3;
                                    }
                                    else if (day <= 1) {
                                        return 4;
                                    }
                                }
                            }
                            else if (hour <= 20) {
                                if (prediction > 2.68846) {
                                    if (isspecial == null) {
                                        return 3;
                                    }
                                    else if (isspecial=="false") {
                                        return 2;
                                    }
                                    else if (isspecial=="true") {
                                        return 4;
                                    }
                                }
                                else if (prediction <= 2.68846) {
                                    return 5;
                                }
                            }
                        }
                        else if (section <= 1) {
                            return 5;
                        }
                    }
                }
            }
            else if (hour <= 16) {
                if (hour > 2) {
                    if (hour > 3) {
                        if (prediction == null) {
                            return 2.52381;
                        }
                        else if (prediction > 3.18846) {
                            if (isspecial == null) {
                                return 2;
                            }
                            else if (isspecial=="false") {
                                if (day == null) {
                                    return 2.5;
                                }
                                else if (day > 3) {
                                    return 3;
                                }
                                else if (day <= 3) {
                                    return 2;
                                }
                            }
                            else if (isspecial=="true") {
                                if (section == null) {
                                    return 1.8;
                                }
                                else if (section > 4) {
                                    if (day == null) {
                                        return 1.5;
                                    }
                                    else if (day > 4) {
                                        return 1;
                                    }
                                    else if (day <= 4) {
                                        return 2;
                                    }
                                }
                                else if (section <= 4) {
                                    return 2;
                                }
                            }
                        }
                        else if (prediction <= 3.18846) {
                            if (hour > 7) {
                                if (day == null) {
                                    return 3.11111;
                                }
                                else if (day > 3) {
                                    if (section == null) {
                                        return 2.6;
                                    }
                                    else if (section > 2) {
                                        return 4;
                                    }
                                    else if (section <= 2) {
                                        if (isspecial == null) {
                                            return 1.66667;
                                        }
                                        else if (isspecial=="false") {
                                            return 3;
                                        }
                                        else if (isspecial=="true") {
                                            return 1;
                                        }
                                    }
                                }
                                else if (day <= 3) {
                                    if (prediction > 2.5) {
                                        if (hour > 8) {
                                            return 3;
                                        }
                                        else if (hour <= 8) {
                                            return 4;
                                        }
                                    }
                                    else if (prediction <= 2.5) {
                                        return 5;
                                    }
                                }
                            }
                            else if (hour <= 7) {
                                if (day == null) {
                                    return 2.5;
                                }
                                else if (day > 4) {
                                    return 3;
                                }
                                else if (day <= 4) {
                                    return 1;
                                }
                            }
                        }
                    }
                    else if (hour <= 3) {
                        if (prediction == null) {
                            return 1.66667;
                        }
                        else if (prediction > 2.18846) {
                            return 3;
                        }
                        else if (prediction <= 2.18846) {
                            return 1;
                        }
                    }
                }
                else if (hour <= 2) {
                    return 5;
                }
            }
        }
    }
    return null;
}







