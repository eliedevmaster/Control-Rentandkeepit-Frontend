import { parseI18nMeta } from "@angular/compiler/src/render3/view/i18n/meta";
import { AlignmentType, Document, HeadingLevel, Packer, 
         Paragraph, ImageRun, TabStopPosition, TabStopType, TextRun, 
         BorderStyle, Table, TableCell , TableRow,
         convertInchesToTwip,
         LevelFormat, UnderlineType, PageBreak, PageNumber, PageNumberFormat, Footer} from "docx";

export class DocumentCreator {
    public create(param: any): Document 
    {   
        const text_ref = "ref# : " + param.refKey;

        const text1 = "Rent & Keep It Pty Ltd (ACN: 003 949 979) (Australian Credit License number 390807) of 41/464-480 Kent St, Sydney, NSW 2000. Tel: 1300 999 599 Fax: (02) 9475 0995 Provider agrees to lease to " + param.customerName + " the Goods described below on the terms and conditions contained in this Schedule and the document titled Terms & Conditions.";
        
        const text2 = 'The Lease Agreement between Rent & Keep It Pty Ltd/Provider and the Hirer consist of the following documents.';
        
        const text3 = 'Rent & Keep It Pty Ltd (ACN 003 949 979) of 41/464-480 Kent St, Sydney, NSW 2000.';
        
        const text4 = param.customerName + ' of ' + param.address +  '       Tel: ' + param.phoneNumber;
        
        const text5 = 'The goods being hired are:		              New ' + param.products;
        const text6 = 'To be kept at:				' + param.address;

        const text7 = 'THE LEASE AGREEMENT';
        const text8 = '– Summary of financial Information:';

        const text9 = 'Term                                                    ' + param.term + ' ';
        const text10 = "commencing on the " + param.startDate;

        const text11 = 'Amount of each repayment                  $' + param.eachRepayment;
        const text12 = 'Frequency of repayments                    ' + param.frequency;
        const text13 = 'Your First Payment Date is                 ' + param.firstPaymentDate;
        const text14 = 'The number of Payments';
        const text14_1 = 'under the lease is			   ' + param.leaseNumber + ' equal repayments';
        
        const text15 = 'The total amount of rental';
        const text15_1 = 'payable under the lease is                    $' + param.totalAmount;

        const text16 = 'Early Termination fee	                  8 weeks of rental payments plus delivery fee for the return of the Goods';
        const text16_1 = '                                                             unless a purchase price is negotiated.';
        
        const text17 = "Rent & Keep It Pty Ltd is the owner of the Goods or is authorized to lease the Goods to you. This lease agreement is not an offer by Rent & Keep It Pty Ltd to pass ownership of the Goods to you nor is it an agreement to purchase the Goods by instalments.  Your rights at the end of the lease will be described in the end of lease statement or you can ask us at any time. ";
        
        const text18 = 'By signing this Agreement, the Hirer acknowledges that they have received, read and agree with:';

        const text19 = 'The hirer also authorizes Rent & Keep It Pty Ltd, and/or its authorized representative, to complete any blanks or correct any errors in this Rental Agreement (including but not limited to, leased equipment, serial numbers, model numbers, the Start Date and Payment Date).';
        
        const text20 = 'SIGNED AND ACCEPTED BY THE HIRER';

        const text21 = 'Signed by the Hirer:';

        const text22 = 'Signature:  	__________________________	    Signature:   	________________________';
        const text23 = 'Print Name:  	__________________________	    Print Name:  	________________________';
        const text24 = 'Date:		__________________________';

        const text25 = 'If more than one Hirer signing this Schedule, each Hirer is severally and jointly liable for the lease repayments.';


        const text26 = 'REFERENCE 1					REFERENCE 2';
        const text27 = 'Name:  	           _____________________	                             Name:  	           _____________________';
        const text28 = 'Phone:              _____________________	                             Phone:              _____________________';
        const text29 = 'Address:	           _____________________	                             Address:           _____________________';
        const text30 = '	           _____________________			                          _____________________';

        const text31 = 'Relationship:     _____________________			Relationship:     _____________________';



        const doc = new Document({
            creator: "Clippy",
            title: "Sample Document",
            description: "A brief example of using docx",
            styles: {
                default: {
                    heading1: {
                        run: {
                            size: 28,
                            bold: true,
                            color: "blue",
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 120,
                            },
                        },
                    },
                    heading2: {
                        run: {
                            size: 26,
                            bold: true,
                        },
                        paragraph: {
                            spacing: {
                                before: 240,
                                after: 120,
                            },
                        },
                    },
                    listParagraph: {
                        run: {
                            color: "black",
                        },
                    },
                },
                paragraphStyles: [
                    {
                        id: "aside",
                        name: "Aside",
                        basedOn: "Normal",
                        next: "Normal",
                        run: {
                            color: "999999",
                            italics: true,
                        },
                        paragraph: {
                            indent: {
                                left: convertInchesToTwip(0.5),
                            },
                            spacing: {
                                line: 276,
                            },
                        },
                    },
                    {
                        id: "wellSpaced",
                        name: "Well Spaced",
                        basedOn: "Normal",
                        quickFormat: true,
                        paragraph: {
                            spacing: { line: 276, before: 20 * 72 * 0.1, after: 20 * 72 * 0.05 },
                        },
                    },
                ],
            },
            numbering: {
                config: [
                    {
                        reference: "my-crazy-numbering",
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.LOWER_LETTER,
                                text: "%1)",
                                alignment: AlignmentType.LEFT,
                            },
                        ],
                    },

                    {
                        reference: "my-crazy-numbering_1",
                        levels: [
                            {
                                level: 0,
                                format: LevelFormat.LOWER_LETTER,
                                text: "%1)",
                                alignment: AlignmentType.LEFT,
                            },
                        ],
                    },
                ],
            },
            sections: [
                {
                    properties: {
                        page: {
                            pageNumbers: {
                                start: 1,
                                formatType: PageNumberFormat.DECIMAL,
                            },
                        },
                    },

                    footers: {
                        default: new Footer({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            children: ["Page Number: ", PageNumber.CURRENT],
                                        }),
                                        new TextRun({
                                            children: [" to ", PageNumber.TOTAL_PAGES],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    },

                    children: [
                        new Paragraph({
                            text: "SCHEDULE LEASE AGREEMENT",
                            heading: HeadingLevel.HEADING_1,
                        }),

                        new Paragraph({
                            text : text_ref,
                            alignment: AlignmentType.RIGHT,
                        }),

                        new Paragraph({
                            text : text1,
                            spacing: {
                                before: 200,
                            },
                        }),
                        new Paragraph({
                            text: text2,
                            spacing: {
                                before: 350,
                                after: 250,
                            },
                        }),

                        new Paragraph({
                            text: "this Schedule;",
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                        }),

                        new Paragraph({
                            text: "the document titled Terms and Conditions; ",
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                        }),

                        new Paragraph({
                            text: "any direct debit agreement as executed by the Hirer from time to time.",
                            numbering: {
                                reference: "my-crazy-numbering",
                                level: 0,
                            },
                        }),

                        new Paragraph({
                            text: "This Lease Agreement is between:",
                            heading: HeadingLevel.HEADING_2,
                        }),

                        new Paragraph({
                            text: text3,
                            spacing: {
                                before: 200,
                                after: 250,
                            },
                        }),

                        new Paragraph({
                            text: "And",
                            heading: HeadingLevel.HEADING_2,
                        }),

                        new Paragraph({
                            text: text4,
                            spacing: {
                                before: 200,
                                after: 250,
                            },
                        }),

                        new Paragraph({
                            border : {
                                top: {
                                    color: "auto",
                                    space: 1,
                                    value: "single",
                                    size: 6,
                                }
                            }
                        }),

                        new Paragraph({
                            text: "Goods",
                            heading: HeadingLevel.HEADING_2,
                            spacing: {
                                before: 100,
                            },
                        }),

                        new Paragraph({
                            text: text5,
                            spacing: {
                                before: 200,
                            },
                        }),
                        new Paragraph({
                            text: text6,
                            spacing: {
                                after: 250,
                            },
                        }),
                        
                        new Paragraph({
                            border : {
                                top: {
                                    color: "auto",
                                    space: 1,
                                    value: "single",
                                    size: 6,
                                }
                            }
                        }),
                        
                        new Paragraph({
                            text: text7,
                            heading: HeadingLevel.HEADING_2,
                            style: "Strong",
                            children: [
                                new TextRun({
                                    text: text8,
                                }),
                            ],
                            spacing: {
                                after: 250,
                            },

                        }),

                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: text9,
                                    bold: true,
                                }),
                                new TextRun(text10),
                            ],
                            spacing: {
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text:text11,
                            spacing: {
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text:text12,
                            spacing: {
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text:text13,
                            spacing: {
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text:text14,   
                        }),
                        new Paragraph({
                            text:text14_1,
                            spacing: {
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text:text15,
                        }),
                        new Paragraph({
                            text:text15_1,
                            spacing: {
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text:text16,
                        }),
                        new Paragraph({
                            text:text16_1,
                            spacing: {
                                after: 200,
                            },
                            children : [
                                new PageBreak(),
                            ],
                        }),

                        new Paragraph({
                            text: "Owner of Goods",
                            heading: HeadingLevel.HEADING_2,
                        }),

                        new Paragraph({
                            style: "Strong",
                            children: [
                                new TextRun({
                                    text: text17,
                                }),
                            ],
                            spacing: {
                                after: 350,
                            },
                            border : {
                                top: {
                                    color: "auto",
                                    space: 10,
                                    value: "single",
                                    size: 20,
                                },
                                bottom: {
                                    color: "auto",
                                    space: 10,
                                    value: "single",
                                    size: 20,
                                },
                                left: {
                                    color: "auto",
                                    space: 10,
                                    value: "single",
                                    size: 20,
                                },
                                right: {
                                    color: "auto",
                                    space: 10,
                                    value: "single",
                                    size: 20,
                                }
                            }
                        }),

                        new Paragraph({
                            text:text18,
                            spacing : {
                                after: 250,
                            }
                        }),

                        new Paragraph({
                            text: "the Lease Terms & Conditions and this Schedule;",
                            numbering: {
                                reference: "my-crazy-numbering_1",
                                level: 0,
                            },
                        }),

                        new Paragraph({
                            text: "Rent & Keep It Pty Ltd Credit Guide; and",
                            numbering: {
                                reference: "my-crazy-numbering_1",
                                level: 0,
                            },
                        }),

                        new Paragraph({
                            text: "Information Statement.",
                            numbering: {
                                reference: "my-crazy-numbering_1",
                                level: 0,
                            },
                            spacing : {
                                after: 350,
                            }
                        }),


                        new Paragraph({
                            text: text19,
                            spacing : {
                                after: 250,
                            }
                        }),

                        new Paragraph({
                            text: text20,
                            heading: HeadingLevel.HEADING_2,
                            spacing: {
                                before: 600,
                            },
                        }),

                        new Paragraph({
                            text: text21,
                            spacing : {
                                after: 200,
                            }
                        }),

                        new Paragraph({
                            text: text22,
                            spacing : {
                                after: 200,
                            }
                        }),

                        new Paragraph({
                            text: text23,
                            spacing : {
                                after: 200,
                            }
                        }),

                        new Paragraph({
                            text: text24,
                            spacing : {
                                after: 250,
                            }
                        }),

                        new Paragraph({
                            text: text25,
                            spacing : {
                                after: 450,
                            }
                        }),

                        new Paragraph({
                            text: text26,
                            heading: HeadingLevel.HEADING_2,
                            spacing: {
                                before: 300,
                                after: 200,
                            },
                        }),

                        new Paragraph({
                            text: text27,
                            spacing : {
                                after: 200,
                            }
                        }),

                        new Paragraph({
                            text: text28,
                            spacing : {
                                after: 200,
                            }
                        }),

                        new Paragraph({
                            text: text29,
                            spacing : {
                                after: 200,
                            }
                        }),

                        new Paragraph({
                            text: text30,
                            spacing : {
                                after: 300,
                            }
                        }),

                        new Paragraph({
                            text: text31,
                            spacing : {
                                after: 200,
                            }
                        }),
                    ],
                },
            ],
        });

        return doc;
    }

}